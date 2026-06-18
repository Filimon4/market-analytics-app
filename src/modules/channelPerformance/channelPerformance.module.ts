import { Module } from '@nestjs/common';
import { ChannelPerformanceController } from './channelPerformance.controller';
import { ChannelPerformanceService } from './channelPerformance.service';
import { ChannelPerformanceTableController } from './channelPerformance.table.controller';
import { ChannelPerformanceMetricsTableController } from './channelPerformanceMetrics.table.controller';
import { ChannelPerformancePropertiesTableController } from './channelPerformanceProperties.table.controller';
import { ChannelPerformancePropertyService } from './channelPerformanceProperty.service';
import { ChannelPerformancePropertyController } from './channelPerformanceProperty.controller';

@Module({
  controllers: [
    ChannelPerformanceController,
    ChannelPerformanceTableController,
    ChannelPerformanceMetricsTableController,
    ChannelPerformancePropertyController,
    ChannelPerformancePropertiesTableController,
  ],
  providers: [ChannelPerformanceService, ChannelPerformancePropertyService],
})
export class ChannelPerformanceModule {}
