import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { TENANT_CLS_NAME } from 'src/common/constants';
import { ProjectApiKeyService } from 'src/modules/projectApiKeys/projectApiKeys.service.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ProjectApiKeyService,
    private readonly cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const apiKey = req.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('Missing API Key');
    }

    const valid = await this.apiKeyService.validateKey(apiKey);

    if (!valid) {
      throw new UnauthorizedException('Invalid or expired API Key');
    }

    const tenantId = valid.projectId.toString();

    req.apiKey = valid;
    req.tenantId = tenantId;
    this.cls.set(TENANT_CLS_NAME, tenantId);

    if (valid.createdBy) {
      req.projectUser = valid.createdBy;
      if (valid.createdBy.user) {
        req.user = valid.createdBy.user;
      }
    }

    return true;
  }
}
