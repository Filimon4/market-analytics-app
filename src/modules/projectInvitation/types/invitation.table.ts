import { Prisma } from '@prisma/client';
import { InvitationSelect } from '../constants/table.constant';

export type TInvitationPayload = Prisma.InvitationGetPayload<{
  select: typeof InvitationSelect;
}>;

export type TInvitationResponse = Omit<TInvitationPayload, 'id'> & {
  id: string;
};
