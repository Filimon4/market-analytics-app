import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelTableController } from './channel.table.controller';
import { MetricsChannelTableController } from './metricsChannel.table.controller';

@Module({
  controllers: [ChannelController, ChannelTableController, MetricsChannelTableController],
  providers: [ChannelService],
})
export class ChannelModule {}
