import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../permissions.constants';
import { PermissionsGuard } from '../guards/permissions.guard';

export const RequirePermissions = (...codes: string[]) => {
  return applyDecorators(SetMetadata(PERMISSIONS_KEY, codes), UseGuards(PermissionsGuard));
};
