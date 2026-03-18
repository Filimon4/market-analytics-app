import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_TENANT_OPTIONAL_KEY = 'isTenantOptional';
export const TenantOptional = () => SetMetadata(IS_TENANT_OPTIONAL_KEY, true);

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const isTenantOptional = this.reflector.getAllAndOverride<boolean>(IS_TENANT_OPTIONAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    let tenantId: string | undefined;

    if (request.user && request.user.tenantId) {
      tenantId = request.user.tenantId;
    } else if (request.headers['x-tenant-id'] || request.headers['x-project-id']) {
      tenantId = (request.headers['x-tenant-id'] || request.headers['x-project-id']) as string;
    }

    if (!tenantId && !isTenantOptional) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    request.tenantId = tenantId;

    return true;
  }
}
