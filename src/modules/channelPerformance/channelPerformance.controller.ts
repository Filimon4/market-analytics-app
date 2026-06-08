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
import { ChannelPerformanceService } from './channelPerformance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { CreateChannelPerformanceDto } from './dto/createChannelPerformance.dto';
import { UpdateChannelPerformanceDto } from './dto/updateChannelPerformance.dto';
import { GetChannelPerformanceListDto } from './dto/getChannelPerformanceList.dto';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { ICreateEntityResponse } from 'src/common/interfaces/ientity.interface';

@Controller('channel-performances')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelPerformanceController {
  constructor(private readonly service: ChannelPerformanceService) {}

  @Post()
  async create(
    @CurrentTenant() projectId: number,
    @Body() dto: CreateChannelPerformanceDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const record = await this.service.create(projectId, dto);

    return {
      result: {
        id: record.id.toString(),
      },
    };
  }

  @Get()
  async list(@CurrentTenant() projectId: number, @Query() dto: GetChannelPerformanceListDto) {
    const list = await this.service.list(projectId, dto.deleted);

    return { result: list };
  }

  @Get(':id')
  async getById(@CurrentTenant() projectId: number, @Param('id') id: string) {
    const record = await this.service.getById(projectId, BigInt(id));

    return { result: record };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@CurrentTenant() projectId: number, @Param('id') id: string, @Body() dto: UpdateChannelPerformanceDto) {
    await this.service.update(projectId, BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.service.delete(projectId, BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.service.restore(projectId, BigInt(id));

    return { result: true };
  }
}
