import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { CreateChannelDto } from './dto/createChannel.dto';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { ICreateEntityResponse } from 'src/common/interfaces/ientity.interface';
import { GetChannelListDto } from './dto/getChannelList.dto';
import { UpdateChannelDto } from './dto/updateChannel.dto';

@Controller('channels')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async create(
    @CurrentTenant() projectId: number,
    @Body() dto: CreateChannelDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const channel = await this.channelService.create(projectId, dto);

    return {
      result: {
        id: channel.id.toString(),
      },
    };
  }

  @Get('select')
  async list(@CurrentTenant() projectId: number, @Query() dto: GetChannelListDto) {
    const list = await this.channelService.list(projectId, dto.deleted);

    return { result: list.map((chnl) => ({ id: chnl.id, code: chnl.name })) };
  }

  @Get(':id')
  async getById(@CurrentTenant() projectId: number, @Param('id') id: string) {
    const channel = await this.channelService.getById(projectId, BigInt(id));

    return {
      result: channel,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@CurrentTenant() projectId: number, @Param('id') id: string, @Body() dto: UpdateChannelDto) {
    await this.channelService.update(projectId, BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.channelService.delete(projectId, BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.channelService.restore(projectId, BigInt(id));

    return { result: true };
  }
}
