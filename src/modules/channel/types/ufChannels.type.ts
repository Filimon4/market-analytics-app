import { Prisma } from '@prisma/client';
import { UfChannelsSelect } from '../constants/ufChannel.constant';

export type TUfChannelsGetPayload = Prisma.UfChannelGetPayload<{
  select: typeof UfChannelsSelect;
}>;
