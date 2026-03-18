import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface CurrentTenantOptions {
  required?: boolean;
}

export const CurrentTenant = createParamDecorator(
  (data: CurrentTenantOptions = { required: true }, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<Request & { tenantId: number }>();

    if (data.required && !request.tenantId) {
      throw new Error('No tenant ID in current context');
    }

    return request.tenantId;
  },
);
