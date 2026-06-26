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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChannelPerformanceService } from '@src/modules/channelPerformance/channelPerformance.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { CreateChannelPerformanceDto } from '@src/modules/channelPerformance/dto/createChannelPerformance.dto';
import { UpdateChannelPerformanceDto } from '@src/modules/channelPerformance/dto/updateChannelPerformance.dto';
import { GetChannelPerformanceListDto } from '@src/modules/channelPerformance/dto/getChannelPerformanceList.dto';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';

@Controller({ path: 'public/channel-performances', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
export class PublicChannelPerformanceController {
  constructor(private readonly service: ChannelPerformanceService) {}

  @Post()
  @RequireApiKeyScopes('performances:write')
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
  @RequireApiKeyScopes('performances:read')
  async list(@CurrentTenant() projectId: number, @Query() dto: GetChannelPerformanceListDto) {
    const list = await this.service.list(projectId, dto.deleted);

    return { result: list };
  }

  @Get(':id')
  @RequireApiKeyScopes('performances:read')
  async getById(@CurrentTenant() projectId: number, @Param('id') id: string) {
    const record = await this.service.getById(projectId, BigInt(id));

    return { result: record };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('performances:write')
  async update(
    @CurrentTenant() projectId: number,
    @Param('id') id: string,
    @Body() dto: UpdateChannelPerformanceDto,
  ) {
    await this.service.update(projectId, BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('performances:write')
  async delete(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.service.delete(projectId, BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('performances:write')
  async restore(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.service.restore(projectId, BigInt(id));

    return { result: true };
  }

  @Put(':entityId/update-metrics')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('performances:write')
  async updateMetrics(@CurrentTenant() projectId: number, @Param('entityId') entityId: string) {
    await this.service.recalculateMetrics(projectId, BigInt(entityId));

    return { result: true };
  }

  @Put(':entityId/update-uf')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('performances:write')
  async updateUf(@CurrentTenant() projectId: number, @Param('entityId') entityId: string) {
    await this.service.updateUf(projectId, BigInt(entityId));

    return { result: true };
  }
}
