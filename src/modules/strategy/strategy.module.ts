import { Module } from '@nestjs/common';
import { StrategyController } from './strategy.controller';
import { StrategyCompareReportService } from './strategyCompareReport.service';
import { StrategyService } from './strategy.service';
import { StrategyTableController } from './strategy.table.controller';

@Module({
  controllers: [StrategyController, StrategyTableController],
  providers: [StrategyService, StrategyCompareReportService],
  exports: [StrategyService, StrategyCompareReportService],
})
export class StrategyModule {}
