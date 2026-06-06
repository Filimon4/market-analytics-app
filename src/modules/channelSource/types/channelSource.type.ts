import { Prisma } from '@prisma/client';
import { ChannelSourcesSelect } from '../constants/channelSource.constant';

export type TChannelSourceGetPayload = Prisma.ChannelSourceGetPayload<{
  select: typeof ChannelSourcesSelect;
}>;
