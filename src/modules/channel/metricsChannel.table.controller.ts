import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IListEntityTableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  MetricsChannelBlockDetails,
  MetricsChannelBlocks,
  MetricsChannelSelect,
} from './constants/matricChannel.constant';
import { TMetricsChannelGetPayload } from './types/metricChannel.type';
import { IEntityResponse } from '@src/common/interfaces/ientity.interface';
import { GetMetricsChannelTableListDto } from './dtoMetrics/getMetricsChannelTableList.dto';

@Controller('channels/:channelId/metrics/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MetricsChannelTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Body() dto: GetMetricsChannelTableListDto,
  ): Promise<IApiResultResponse<IListEntityTableListResponse<TMetricsChannelGetPayload>>> {
    const whereInput: Prisma.MetricChannelWhereInput = {
      channel: {
        id: BigInt(channelId),
      },
    };

    const total = await this.prismaService.metricChannel.count({ where: whereInput, orderBy: { id: 'asc' } });
    const channelMetricsData = await this.prismaService.metricChannel.findMany({
      where: whereInput,
      select: MetricsChannelSelect,
      orderBy: { id: 'asc' },
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        data: channelMetricsData,
        page: dto.page,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  @Get('create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blockDetails' | 'blocks'>>> {
    return {
      result: {
        blocks: MetricsChannelBlocks,
        blockDetails: MetricsChannelBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Param('id') id: string,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const channelData = await this.prismaService.metricChannel.findFirst({
      where: {
        id: BigInt(id),
        channel: {
          id: BigInt(channelId),
        },
      },
      select: MetricsChannelSelect,
    });

    if (!channelData) {
      throw new NotFoundException('Channel metric not found');
    }

    // TODO FEATURE: добавить удаление и востановелние. Динамически

    return {
      result: {
        blocks: MetricsChannelBlocks,
        blockDetails: MetricsChannelBlockDetails,
        data: {
          ...channelData,
        },
      },
    };
  }
}
