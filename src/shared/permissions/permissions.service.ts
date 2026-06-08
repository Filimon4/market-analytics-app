import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGrantedPermissionCodes(userId: bigint, projectId: bigint): Promise<string[] | null> {
    const membership = await this.prisma.userToProject.findFirst({
      where: {
        userId,
        projectId,
        blocked: false,
      },
      include: {
        userRole: {
          include: {
            rolePermission: {
              where: { granted: true },
              include: {
                permission: {
                  select: { code: true },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return null;
    }

    return membership.userRole.rolePermission.map((rp) => rp.permission.code);
  }
}
