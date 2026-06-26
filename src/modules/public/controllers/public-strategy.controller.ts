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
import { StrategyService } from '@src/modules/strategy/strategy.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { CreateStrategyDto } from '@src/modules/strategy/dto/createStrategy.dto';
import { UpdateStrategyDto } from '@src/modules/strategy/dto/updateStrategy.dto';
import { GetStrategyListDto } from '@src/modules/strategy/dto/getStrategyList.dto';
import { GetStrategyStatisticsDto } from '@src/modules/strategy/dto/getStrategyStatistics.dto';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';

@Controller({ path: 'public/strategies', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
export class PublicStrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  @RequireApiKeyScopes('strategies:write')
  async create(
    @CurrentTenant() projectId: number,
    @Body() dto: CreateStrategyDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const strategy = await this.strategyService.create(projectId, dto);

    return {
      result: {
        id: strategy.id.toString(),
      },
    };
  }

  @Get('select')
  @RequireApiKeyScopes('strategies:read')
  async list(@CurrentTenant() projectId: number, @Query() dto: GetStrategyListDto) {
    const list = await this.strategyService.list(projectId, dto.includeDeleted);

    return {
      result: list.map((str) => ({
        id: str.id,
        code: str.name,
        description: str.description,
        createdAt: str.createdAt,
      })),
    };
  }

  @Get(':id/statistics')
  @RequireApiKeyScopes('strategies:read')
  async getStatistics(
    @CurrentTenant() projectId: bigint,
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: GetStrategyStatisticsDto,
  ) {
    const statistics = await this.strategyService.getStatistics(projectId, BigInt(id), dto);

    return { result: statistics };
  }

  @Get(':id')
  @RequireApiKeyScopes('strategies:read')
  async getById(@CurrentTenant() projectId: bigint, @Param('id') id: string) {
    const strategy = await this.strategyService.getById(projectId, BigInt(id));

    return { result: strategy };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('strategies:write')
  async update(@CurrentTenant() projectId: bigint, @Param('id') id: string, @Body() dto: UpdateStrategyDto) {
    await this.strategyService.update(projectId, BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('strategies:write')
  async delete(@CurrentTenant() projectId: bigint, @Param('id') id: string) {
    await this.strategyService.delete(projectId, BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('strategies:write')
  async restore(@CurrentTenant() projectId: bigint, @Param('id') id: string) {
    await this.strategyService.restore(projectId, BigInt(id));

    return { result: true };
  }
}
