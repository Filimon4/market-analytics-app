import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelTableController } from './channel.table.controller';
import { MetricsChannelTableController } from './metricsChannel.table.controller';
import { MetricsChannelController } from './metricsChannel.controller';
import { MetricsChannelService } from './metricsChannel.service';
import { UfChannelsService } from './ufChannels.service';
import { UfChannelsController } from './ufChannels.controller';

@Module({
  controllers: [
    ChannelController,
    ChannelTableController,
    MetricsChannelController,
    MetricsChannelTableController,
    UfChannelsController,
  ],
  providers: [ChannelService, MetricsChannelService, UfChannelsService],
})
export class ChannelModule {}
