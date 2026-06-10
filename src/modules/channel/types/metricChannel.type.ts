import { Prisma } from '@prisma/client';
import { MetricsChannelSelect } from '../constants/matricChannel.constant';

export type TMetricsChannelGetPayload = Prisma.MetricChannelGetPayload<{
  select: typeof MetricsChannelSelect;
}>;
