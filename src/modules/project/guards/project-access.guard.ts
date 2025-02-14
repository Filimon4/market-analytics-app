import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { ROLES_KEY } from "../constants/meta";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { PrismaService } from "src/common/db/prisma.service";

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user, params } = context.switchToHttp().getRequest<Request>();

    const { projectId } = params

    const userRole = await this.prismaService.role.findFirstOrThrow({
      where: {
        userToProject: {
          some: {
            userId: user.id
          }
        },
        id: Number(projectId),
      },
      select: {
        code: true,
        id: true,
        userToProject: {
          select: {
            blocked: true,
            id: true
          }
        }
      },
    })

    if (userRole)

    return 
  }
}