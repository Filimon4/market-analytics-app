import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StrategiesBlockDetails, StrategiesBlocks, StrategiesColumns, StrategiesSelect } from './constants/strategy.constant';
import { GetStrategiesTableListDto } from './dto/getStrategiesTableList.dto';
import { TStrategyGetPayload } from './types/strategy.type';

@Controller('strategies/table/')
@UseGuards(JwtAuthGuard, TenantGuard)
export class StrategyTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Body() dto: GetStrategiesTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TStrategyGetPayload>>> {
    const whereInput: Prisma.StrategyWhereInput = {
      projectId,
    };

    if (dto.filter?.name) {
      whereInput.name = { contains: dto.filter.name, mode: 'insensitive' };
    }

    if (dto.filter?.description) {
      whereInput.description = { contains: dto.filter.description, mode: 'insensitive' };
    }

    if (dto.filter?.deleted !== undefined) {
      whereInput.deleted = dto.filter.deleted;
    }

    if (dto.filter?.createdAt) {
      whereInput.createdAt = {
        gte: dto.filter.createdAt.from,
        lte: dto.filter.createdAt.to,
      };
    }

    const total = await this.prismaService.strategy.count({ where: whereInput, orderBy: { id: 'asc' } });
    const strategiesData = await this.prismaService.strategy.findMany({
      select: StrategiesSelect,
      orderBy: { id: 'asc' },
      where: whereInput,
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: StrategiesColumns,
        data: strategiesData,
        page: dto.page,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  @Get('create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: StrategiesBlocks,
        blockDetails: StrategiesBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const strategyData = await this.prismaService.strategy.findFirst({
      where: {
        id,
        projectId,
      },
      select: StrategiesSelect,
    });

    if (!strategyData) {
      throw new NotFoundException('Strategy not found');
    }

    return {
      result: {
        blocks: StrategiesBlocks,
        blockDetails: StrategiesBlockDetails,
        data: strategyData,
      },
    };
  }
}
