import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/meta';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from 'src/common/db/prisma.service';
import { Role, User } from '@prisma/client';

export const AccessCodes = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccess = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredAccess || requiredAccess.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User & { role: Pick<Role, 'id' | 'code'> }; tenantId: string }>();

    const { user, tenantId } = request;

    const userRole = await this.prismaService.role.findFirstOrThrow({
      where: {
        userToProject: {
          some: {
            userId: user.id,
          },
        },
        projectId: BigInt(tenantId),
      },
      select: {
        code: true,
        id: true,
        userToProject: {
          select: {
            id: true,
            roleId: true,
          },
        },
      },
    });

    console.log(`userRole: ${JSON.stringify(userRole)}`);

    const permissions = await this.prismaService.rolePermission.findMany({});

    if (!requiredAccess.includes(userRole.code)) {
      throw new ForbiddenException('Cannot access this resource');
    }

    request.user.role = userRole;

    return;
  }
}
