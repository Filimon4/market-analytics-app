import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { API_KEY_SCOPES_KEY } from '@src/modules/projectApiKeys/constants';
import { Request } from 'express';

@Injectable()
export class ApiKeyScopeGuard implements CanActivate {
  private logger = new Logger(ApiKeyScopeGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<string[] | undefined>(API_KEY_SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredScopes?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.apiKey;

    if (!apiKey) {
      throw new ForbiddenException('API key required for this endpoint');
    }

    const grantedScopes = apiKey.scope
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    this.logger.debug(`grantedScopes: ${grantedScopes.join(' | ')}`);

    const hasAllScopes = requiredScopes.every((scope) => grantedScopes.includes(scope));

    if (!hasAllScopes) {
      throw new ForbiddenException('Insufficient API key scopes');
    }

    return true;
  }
}
