import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../permissions.constants';

export const RequirePermissions = (...codes: string[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(PERMISSIONS_KEY, codes);
