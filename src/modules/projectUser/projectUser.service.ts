import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class ProjectUserService {
  protected readonly logger = new Logger();
  constructor(private readonly prismaService: PrismaService) {}

  async createUser() {}

  async updateUser(projectId: number, userData: UpdateUserDto) {
    const data: Prisma.UserToProjectUpdateInput = {
      project: {
        connect: {
          id: projectId,
        },
      },
    };

    this.logger.debug(`updateUser | projectId: ${projectId} | userData: ${JSON.stringify(userData)}`);

    return this.prismaService.$transaction(async (trx) => {
      const existingUserRaw = await trx.$queryRaw<{ id: number; userRoleCode: string }[]>`
        select 
            usrProj.*,
            usrRole.code as "userRoleCode"
        from public."UserToProject" usrProj
        inner join public."Role" usrRole on usrRole.id = usrProj."roleId"
        where usrProj.id = ${userData.id} and usrProj."projectId" = ${projectId}
        limit 1
        for update;
      `;

      this.logger.debug(`existing user: ${JSON.stringify(existingUserRaw)}`);

      if (!existingUserRaw.length) throw new NotFoundException('Failed to find user');

      const existingUser = existingUserRaw[0];

      if (userData.blocked !== undefined && typeof userData.blocked === 'boolean') {
        data.blocked = userData.blocked;
      }

      if (userData.userRole.code && userData.userRole.code !== existingUser.userRoleCode) {
        const newRole = await trx.role.findFirst({
          where: {
            code: userData.userRole.code,
            project: {
              id: projectId,
            },
          },
          select: {
            id: true,
            code: true,
          },
        });

        data.userRole = {
          connect: newRole,
        };
      }

      this.logger.debug(`update user data: ${data}`);

      return await trx.userToProject.update({
        data,
        where: {
          id: BigInt(userData.id),
        },
      });
    });
  }
}
