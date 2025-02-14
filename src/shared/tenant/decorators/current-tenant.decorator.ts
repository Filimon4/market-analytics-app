import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<Request & {tenantId: number}>()

    if (!request.tenantId) {
      throw new Error('No tenant ID in current context');
    }

    return request.tenantId;
  },
);