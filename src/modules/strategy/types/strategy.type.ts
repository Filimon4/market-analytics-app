import { Prisma } from '@prisma/client';
import { StrategiesSelect } from '../constants/strategy.constant';

export type TStrategyGetPayload = Prisma.StrategyGetPayload<{
  select: typeof StrategiesSelect;
}>;
