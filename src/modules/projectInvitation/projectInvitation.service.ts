import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { EmailService } from 'src/shared/email/email.service';
import { InvitationSendDto } from './dto/invitationSend.dto';
import { $Enums, Prisma, User as UserDB } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { InvitationListDto } from './dto/infitationLIst.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);
  private readonly FRONTEND_URL: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.FRONTEND_URL = configService.getOrThrow('HTTP_DOMAIN');
  }

  async send(projectId: number, dto: InvitationSendDto, user: UserDB): Promise<string> {
    const membership = await this.prismaService.userToProject.findFirst({
      where: { projectId: projectId, userId: user.id },
      include: { userRole: true },
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this project');
    }

    const existing = await this.prismaService.invitation.findFirst({
      where: { email: dto.email, projectId, status: { in: ['PENDING', 'EXPIRED'] } },
    });

    this.logger.debug(`existing invitation: ${JSON.stringify(existing)}`);

    if (existing && ['PENDING', 'EXPIRED'].includes(existing.status)) {
      throw new ConflictException('Already there is invitation for the email');
    }

    const potentialMember = await this.prismaService.userToProject.findFirst({
      where: {
        projectId,
        AND: {
          user: {
            email: dto.email,
          },
        },
      },
    });

    if (potentialMember) {
      throw new BadRequestException('This user already in project');
    }

    const invitation = await this.prismaService.$transaction(async (trx) => {
      const invitation = await trx.invitation.create({
        data: {
          email: dto.email,
          invitedById: membership.id,
          projectId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
          token: randomUUID(),
        },
        include: {
          project: true,
        },
      });

      const inviteLink = this.getInvitationLink(invitation.token);

      await this.emailService
        .sendInvitation({
          to: dto.email,
          inviterName: user.email,
          projectName: invitation.project.name,
          inviteLink,
        })
        .catch((err) => {
          this.logger.debug(`Failed to send invitation email: ${err}`);
          throw err;
        });

      return invitation;
    });

    return invitation.token;
  }

  async resend(projectId: number, token: string, user: UserDB) {
    const membership = await this.prismaService.userToProject.findFirst({
      where: { projectId: projectId, userId: user.id },
      include: { userRole: true },
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this project');
    }

    const existingInvitation = await this.prismaService.invitation.findFirst({
      where: { token, projectId },
    });

    if (!existingInvitation) {
      throw new BadRequestException('Failed to find invitation');
    }

    const potentialInvitation = await this.prismaService.invitation.findFirst({
      where: {
        projectId,
        email: existingInvitation.email,
        status: {
          in: ['PENDING'],
        },
      },
    });

    if (potentialInvitation) {
      throw new ConflictException('Already there is an invitation');
    }

    if (existingInvitation && ['ACCEPTED', 'DECLINED'].includes(existingInvitation.status)) {
      throw new ConflictException('The invitation cannot be resend');
    }

    await this.prismaService.$transaction(async (trx) => {
      const updatedInvitation = await trx.invitation.update({
        where: {
          id: existingInvitation.id,
        },
        data: {
          status: $Enums.InvitationStatus.PENDING,
          token: randomUUID(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
          invitedById: membership.id,
        },
        include: {
          project: true,
        },
      });

      const inviteLink = this.getInvitationLink(updatedInvitation.token);

      await this.emailService
        .sendInvitation({
          to: updatedInvitation.email,
          inviterName: user.email,
          projectName: updatedInvitation.project.name,
          inviteLink,
        })
        .catch((err) => {
          this.logger.debug(`Failed to send invitation email: ${err}`);
          throw err;
        });
    });

    return true;
  }

  async accept(token: string, user: UserDB) {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { token, email: user.email },
      include: { project: true },
    });

    if (!invitation) {
      throw new NotFoundException('There is not invitation');
    }

    if (new Date() > invitation.expiresAt) {
      await this.prismaService.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('The invitation expired');
    }

    if (invitation.status === 'ACCEPTED') {
      return true;
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException(`The invitation ${invitation.status.toLowerCase()}`);
    }

    const potentionMember = await this.prismaService.userToProject.findFirst({
      where: {
        userId: user.id,
        projectId: invitation.projectId,
      },
    });

    if (potentionMember) {
      throw new BadRequestException('There is already user in project');
    }

    await this.prismaService.$transaction(async (tx) => {
      const defaultRole = await tx.role.findFirst({
        where: {
          code: 'invited',
        },
      });

      if (!defaultRole) {
        throw new InternalServerErrorException('There is no default invited role');
      }

      await tx.userToProject.create({
        data: {
          userId: user.id,
          projectId: invitation.projectId,
          roleId: defaultRole.id,
          blocked: false,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });
    });

    return true;
  }

  async decline(token: string) {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('There is no invitation');
    }

    if (new Date() > invitation.expiresAt) {
      await this.prismaService.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('The invitation expired');
    }

    if (invitation.status === 'DECLINED') {
      return true;
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('There is no invitation or already procecced');
    }

    await this.prismaService.invitation.update({
      where: { id: invitation.id },
      data: { status: 'DECLINED' },
    });

    return true;
  }

  async cancel(projectId: number, token: string, user: UserDB) {
    this.logger.debug(`user: ${JSON.stringify(user)}`);

    const membership = await this.prismaService.userToProject.findFirst({
      where: { projectId: projectId, userId: user.id },
      include: { userRole: true },
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this project');
    }

    const invitation = await this.prismaService.invitation.findFirst({
      where: { token, invitedById: membership.id },
    });

    this.logger.debug(`invitation: ${JSON.stringify(invitation)}`);

    if (!invitation || invitation.status !== 'PENDING') {
      throw new BadRequestException('There is no invitation or already procecced');
    }

    await this.prismaService.invitation.update({
      where: { id: invitation.id },
      data: { status: 'CANCELLED' },
    });

    return true;
  }

  async list(projectId: number, dto: InvitationListDto) {
    const where: Prisma.InvitationFindManyArgs['where'] = { projectId };

    if (dto.filter?.status) {
      where.status = dto.filter.status as $Enums.InvitationStatus;
    }

    if (dto.filter?.email) {
      where.email = dto.filter.email;
    }

    return this.prismaService.invitation.findMany({
      where,
      include: {
        project: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByToken(token: string, user: UserDB) {
    const invitation = await this.prismaService.invitation.findFirst({
      where: {
        token,
        email: user.email,
      },
      include: {
        project: true,
      },
    });

    if (!invitation) {
      throw new BadRequestException('Failed to finde invitation');
    }

    return invitation;
  }

  /**
   * Возвращает ссылку клиентского приложение для приглашение
   * @param token токен
   * @returns
   */
  private getInvitationLink(token: string): string {
    const params = new URLSearchParams({ token });
    return `${this.FRONTEND_URL}/invite?${params.toString()}`;
  }
}
