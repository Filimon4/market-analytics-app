import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelTableController } from './channel.table.controller';

@Module({
  controllers: [ChannelController, ChannelTableController],
  providers: [ChannelService],
})
export class ChannelModule {}
