import { Prisma } from '@prisma/client';
import { RolesSelect } from '../constants/role.constant';

export type TRoleGetPayload = Prisma.RoleGetPayload<{
  select: typeof RolesSelect;
}>;
