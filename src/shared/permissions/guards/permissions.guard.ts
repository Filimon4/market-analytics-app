import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY, PermissionRequirement } from '../permissions.constants';
import { PermissionsService } from '../permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<PermissionRequirement | undefined>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requirement?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.user?.id;
    const tenantId = request.tenantId;

    if (!userId || !tenantId) {
      throw new ForbiddenException('Cannot access this resource');
    }

    const granted = await this.permissionsService.getGrantedPermissionCodes(userId, BigInt(tenantId));

    if (granted === null) {
      throw new ForbiddenException('Cannot access this resource');
    }

    const allowed = requirement.some((code) => granted.includes(code));

    if (!allowed) {
      throw new ForbiddenException('Cannot access this resource');
    }

    return true;
  }
}
