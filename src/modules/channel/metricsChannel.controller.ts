import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';
import { MetricsChannelService } from './metricsChannel.service';
import { CreateMetricsChannelDto } from './dtoMetrics/createMetricsChannel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';
import { UpdateMetricsChannelDto } from './dtoMetrics/updateMetricsChannel.dto';

@Controller({ path: 'channels/:channelId/metrics', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class MetricsChannelController {
  constructor(private readonly metricsChannelService: MetricsChannelService) {}

  @Post()
  async create(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Body() dto: CreateMetricsChannelDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const metricsChannel = await this.metricsChannelService.create(BigInt(channelId), dto);

    return {
      result: {
        id: metricsChannel.id.toString(),
      },
    };
  }

  @Patch(':id')
  async update(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMetricsChannelDto,
  ) {
    await this.metricsChannelService.update(BigInt(channelId), BigInt(id), dto);

    return {
      result: true,
    };
  }

  @Delete(':id')
  async delete(@CurrentTenant() projectId: number, @Param('channelId') channelId: string, @Param('id') id: string) {
    await this.metricsChannelService.delete(BigInt(channelId), BigInt(id));

    return {
      result: true,
    };
  }

  @Patch(':id/restore')
  async restore(@CurrentTenant() projectId: number, @Param('channelId') channelId: string, @Param('id') id: string) {
    await this.metricsChannelService.restore(BigInt(channelId), BigInt(id));

    return {
      result: true,
    };
  }
}
