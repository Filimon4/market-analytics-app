import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
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
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() dto: CreateMetricsChannelDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const metricsChannel = await this.metricsChannelService.create(channelId, dto);

    return {
      result: {
        id: metricsChannel.id.toString(),
      },
    };
  }

  @Patch(':id')
  async update(
    @CurrentTenant() projectId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMetricsChannelDto,
  ) {
    await this.metricsChannelService.update(channelId, id, dto);

    return {
      result: true,
    };
  }
}
