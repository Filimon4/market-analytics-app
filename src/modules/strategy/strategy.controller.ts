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
import { StrategyService } from './strategy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { CreateStrategyDto } from './dto/createStrategy.dto';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { ICreateEntityResponse } from 'src/common/interfaces/ientity.interface';
import { UpdateStrategyDto } from './dto/updateStrategy.dto';
import { GetStrategyListDto } from './dto/getStrategyList.dto';
import { GetStrategyStatisticsDto } from './dto/getStrategyStatistics.dto';
import { CreateCompareStrategyReportDto } from '@src/modules/strategy/dto/createCompareReport.dto';

@Controller('strategies')
@UseGuards(JwtAuthGuard, TenantGuard)
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
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
  async getStatistics(
    @CurrentTenant() projectId: bigint,
    @Param('id', ParseIntPipe) id: number,
    @Query() dto: GetStrategyStatisticsDto,
  ) {
    const statistics = await this.strategyService.getStatistics(projectId, BigInt(id), dto);

    return { result: statistics };
  }

  @Get(':id')
  async getById(@CurrentTenant() projectId: bigint, @Param('id') id: string) {
    const strategy = await this.strategyService.getById(projectId, BigInt(id));

    return { result: strategy };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@CurrentTenant() projectId: bigint, @Param('id') id: string, @Body() dto: UpdateStrategyDto) {
    await this.strategyService.update(projectId, BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentTenant() projectId: bigint, @Param('id') id: string) {
    await this.strategyService.delete(projectId, BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@CurrentTenant() projectId: bigint, @Param('id') id: string) {
    await this.strategyService.restore(projectId, BigInt(id));

    return { result: true };
  }

  @Post('compare/report')
  @HttpCode(HttpStatus.CREATED)
  async createCompareReoprt(@CurrentTenant() projectId: bigint, @Body() dto: CreateCompareStrategyReportDto) {}
}
