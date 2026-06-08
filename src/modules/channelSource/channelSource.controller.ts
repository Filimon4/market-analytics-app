import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChannelSourceService } from './channelSource.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { CreateChannelSourceDto } from './dto/createChannelSource.dto';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { ICreateEntityResponse } from 'src/common/interfaces/ientity.interface';
import { UpdateChannelSourceDto } from './dto/updateChannelSource.dto';
import { GetChannelSourceListDto } from './dto/getChannelSourceList.dto';

@Controller('channel-sources')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelSourceController {
  constructor(private readonly channelSourceService: ChannelSourceService) {}

  @Post()
  async create(@Body() dto: CreateChannelSourceDto): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const channelSource = await this.channelSourceService.create(dto);

    return {
      result: {
        id: channelSource.id.toString(),
      },
    };
  }

  @Get('select')
  async list(@Query() dto: GetChannelSourceListDto) {
    const list = await this.channelSourceService.list(dto.includeDeleted);

    return {
      result: list.map((chnl) => ({
        id: chnl.id,
        code: chnl.name,
      })),
    };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const channelSource = await this.channelSourceService.getById(id);

    return {
      result: channelSource,
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: UpdateChannelSourceDto) {
    await this.channelSourceService.update(dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.channelSourceService.delete(id);

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.channelSourceService.restore(id);

    return { result: true };
  }
}
