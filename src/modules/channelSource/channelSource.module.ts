import { Module } from '@nestjs/common';
import { ChannelSourceController } from './channelSource.controller';
import { ChannelSourceService } from './channelSource.service';
import { ChannelSourceTableController } from './channelSource.table.controller';

@Module({
  controllers: [ChannelSourceController, ChannelSourceTableController],
  providers: [ChannelSourceService],
  exports: [ChannelSourceService],
})
export class ChannelSourceModule {}
