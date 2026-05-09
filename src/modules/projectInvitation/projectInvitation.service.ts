import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { EmailService } from 'src/shared/email/email.service';
import { InvitationSendDto } from './dto/invitationSend.dto';
import { $Enums, Prisma, User as UserDB } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { InvitationListDto } from './dto/infitationLIst.dto';
import { InvitationResendDto } from './dto/invitationResend.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class InvitationService {
  private readonly FRONTEND_URL: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.FRONTEND_URL = configService.getOrThrow('HTTP_DOMAIN');
  }

  // TODO: Добавить проверку прав (permission PROJECT_INVITE_USERS)
  async send(projectId: number, dto: InvitationSendDto, user: UserDB) {
    const membership = await this.prismaService.userToProject.findFirst({
      where: { projectId: projectId, userId: user.id },
      include: { userRole: true },
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this project');
    }

    const existing = await this.prismaService.invitation.findUnique({
      where: { email_projectId: { email: dto.email, projectId } },
    });

    if (existing && !['PENDING', 'EXPIRED', 'CANCELLED'].includes(existing.status)) {
      throw new ConflictException('Already there is invitation for the email');
    }

    const invitation = await this.prismaService.invitation.create({
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

    const inviteLink = `${this.FRONTEND_URL}/invite/${invitation.token}`;

    this.emailService
      .sendInvitation({
        to: dto.email,
        inviterName: user.email,
        projectName: invitation.project.name,
        inviteLink,
      })
      .catch((err) => console.error('Failed to send invitation email:', err));

    return invitation;
  }

  async resend(projectId: number, dto: InvitationResendDto, user: UserDB) {
    const membership = await this.prismaService.userToProject.findFirst({
      where: { projectId: projectId, userId: user.id },
      include: { userRole: true },
    });

    if (!membership) {
      throw new BadRequestException('You are not a member of this project');
    }

    const existingInvitation = await this.prismaService.invitation.findUnique({
      where: { id: dto.id },
    });

    if (existingInvitation && ['ACCEPTED', 'DECLINED'].includes(existingInvitation.status)) {
      throw new ConflictException('The invitation cannot be resend');
    }

    this.prismaService.$transaction(async (trx) => {
      const updatedInvitation = await trx.invitation.update({
        where: {
          id: existingInvitation.id,
        },
        data: {
          status: $Enums.InvitationStatus.PENDING,
          token: randomUUID(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
        },
        include: {
          project: true,
        },
      });

      const inviteLink = `${this.FRONTEND_URL}/invite/${updatedInvitation.token}`;

      this.emailService
        .sendInvitation({
          to: updatedInvitation.email,
          inviterName: user.email,
          projectName: updatedInvitation.project.name,
          inviteLink,
        })
        .catch((err) => {
          console.error('Failed to send invitation email:', err);
          throw err;
        });
    });

    return true;
  }

  async accept(token: string, user: UserDB) {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { token },
      include: { project: true },
    });

    if (!invitation) {
      throw new NotFoundException('There is not invitation');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException(`The invitation ${invitation.status.toLowerCase()}`);
    }

    if (new Date() > invitation.expiresAt) {
      await this.prismaService.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('The invitation expired');
    }

    const userId = user?.id;

    if (!userId) {
      throw new BadRequestException('The user must be authorized');
    }

    console.log(invitation);

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new BadRequestException('Email of user is not equal email in invitation!');
    }

    const potentionProjectUser = await this.prismaService.userToProject.findFirst({
      where: {
        userId,
        projectId: invitation.projectId,
      },
    });

    if (potentionProjectUser) {
      await this.prismaService.invitation.update({
        where: { id: invitation.id },
        data: { status: 'CANCELLED' },
      });
      throw new BadRequestException('There is already user in project');
    }

    return await this.prismaService.$transaction(async (tx) => {
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
          userId,
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
  }

  async decline(token: string, user: UserDB) {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { token, invitedById: user.id },
    });

    if (!invitation || invitation.status !== 'PENDING') {
      throw new BadRequestException('There is no invitation or already procecced');
    }

    await this.prismaService.invitation.update({
      where: { id: invitation.id },
      data: { status: 'DECLINED' },
    });

    return true;
  }

  async cancel(token: string, user: UserDB) {
    const invitation = await this.prismaService.invitation.findFirst({
      where: { token, invitedById: user.id },
    });

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

    if (dto.status) {
      where.status = dto.status as $Enums.InvitationStatus;
    }

    return this.prismaService.invitation.findMany({
      where,
      include: {
        project: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
