import { Prisma } from '@prisma/client';
import { ChannelsSelect } from '../constants/channel.constant';

export type TChannelGetPayload = Prisma.ChannelGetPayload<{
  select: typeof ChannelsSelect;
}>;
