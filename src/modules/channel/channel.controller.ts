import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() dto: CreateChannelDto) {
    return this.channelService.create(dto);
  }

  @Get()
  async findAll() {
    const list = await this.channelService.findAll();

    return { list };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.channelService.update(BigInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(BigInt(id));
  }
}
