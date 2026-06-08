import { Prisma } from '@prisma/client';
import { ChannelPerformancesSelect } from '../constants/channelPerformance.constant';

export type TChannelPerformanceGetPayload = Prisma.ChannelPerformanceGetPayload<{
  select: typeof ChannelPerformancesSelect;
}>;
