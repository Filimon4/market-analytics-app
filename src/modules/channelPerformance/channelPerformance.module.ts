import { Module } from '@nestjs/common';
import { ChannelPerformanceController } from './channelPerformance.controller';
import { ChannelPerformanceService } from './channelPerformance.service';

@Module({
  controllers: [ChannelPerformanceController],
  providers: [ChannelPerformanceService],
})
export class ChannelPerformanceModule {}
