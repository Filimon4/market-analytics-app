import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    let tenantId: string | undefined;

    if (request.user && request.user.tenantId) {
      tenantId = request.user.tenantId;
    }
    else if (request.headers['x-tenant-id'] || request.headers['x-project-id']) {
      tenantId = (request.headers['x-tenant-id'] || request.headers['x-project-id']) as string;
    }
    else if (request.params?.tenantId || request.params?.projectId) {
      tenantId = request.params.tenantId || request.params.projectId;
    }

    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    request.tenantId = tenantId

    return true;
  }
}