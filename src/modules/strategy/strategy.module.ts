import { Module } from '@nestjs/common';
import { StrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';
import { StrategyTableController } from './strategy.table.controller';

@Module({
  controllers: [StrategyController, StrategyTableController],
  providers: [StrategyService],
})
export class StrategyModule {}
