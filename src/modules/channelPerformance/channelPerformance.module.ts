import { Module } from '@nestjs/common';
import { ChannelPerformanceController } from './channelPerformance.controller';
import { ChannelPerformanceService } from './channelPerformance.service';
import { ChannelPerformanceTableController } from './channelPerformance.table.controller';

@Module({
  controllers: [ChannelPerformanceController, ChannelPerformanceTableController],
  providers: [ChannelPerformanceService],
})
export class ChannelPerformanceModule {}
