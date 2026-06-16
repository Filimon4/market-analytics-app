import { Module } from '@nestjs/common';
import { ChannelPerformanceController } from './channelPerformance.controller';
import { ChannelPerformanceService } from './channelPerformance.service';
import { ChannelPerformanceTableController } from './channelPerformance.table.controller';
import { ChannelPerformanceMetricsTableController } from './channelPerformanceMetrics.table.controller';

@Module({
  controllers: [
    ChannelPerformanceController,
    ChannelPerformanceTableController,
    ChannelPerformanceMetricsTableController,
  ],
  providers: [ChannelPerformanceService],
})
export class ChannelPerformanceModule {}
