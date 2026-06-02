import { Injectable, CanActivate, ExecutionContext, SetMetadata, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TENANT_CLS_NAME } from '@src/common/constants';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';

export const IS_TENANT_OPTIONAL_KEY = 'isTenantOptional';
export const TenantOptional = () => SetMetadata(IS_TENANT_OPTIONAL_KEY, true);

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    protected readonly cls: ClsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const isTenantOptional = this.reflector.getAllAndOverride<boolean>(IS_TENANT_OPTIONAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const tenantId = this.cls.get<string>(TENANT_CLS_NAME);

    if (!tenantId && !isTenantOptional) {
      throw new ForbiddenException('Tenant ID is required');
    }

    request.tenantId = tenantId;

    return true;
  }
}
