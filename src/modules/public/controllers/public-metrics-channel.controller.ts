import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MetricsChannelService } from '@src/modules/channel/metricsChannel.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CreateMetricsChannelDto } from '@src/modules/channel/dtoMetrics/createMetricsChannel.dto';
import { UpdateMetricsChannelDto } from '@src/modules/channel/dtoMetrics/updateMetricsChannel.dto';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';

@Controller({ path: 'public/channels/:channelId/metrics', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
@RequireApiKeyScopes('channels:write')
export class PublicMetricsChannelController {
  constructor(private readonly metricsChannelService: MetricsChannelService) {}

  @Post()
  async create(
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
  async update(@Param('channelId') channelId: string, @Param('id') id: string, @Body() dto: UpdateMetricsChannelDto) {
    await this.metricsChannelService.update(BigInt(channelId), BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  async delete(@Param('channelId') channelId: string, @Param('id') id: string) {
    await this.metricsChannelService.delete(BigInt(channelId), BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  async restore(@Param('channelId') channelId: string, @Param('id') id: string) {
    await this.metricsChannelService.restore(BigInt(channelId), BigInt(id));

    return { result: true };
  }
}
