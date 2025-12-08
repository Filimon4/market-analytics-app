import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from 'src/modules/apiKeys/apiKeys.service.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

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

    req.apiKey = valid;
    return true;
  }
}
