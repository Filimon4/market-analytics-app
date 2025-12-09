import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
  mixin,
} from '@nestjs/common';
import { Request } from 'express';

export function StatusGuard(requiredStatus: string): Type<CanActivate> {
  @Injectable()
  class StatusGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('Client not found in request');
      }

      const clientStatus = user.statusId;

      if (!clientStatus) {
        throw new ForbiddenException('Client status not found');
      }

      if (String(clientStatus) !== String(requiredStatus)) {
        throw new ForbiddenException(
          `Access denied. Required status: ${requiredStatus}, got: ${clientStatus}`,
        );
      }

      return true;
    }
  }

  return mixin(StatusGuardMixin);
}
