import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IMetricsTableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetChannelMetricsTableListDto } from './dto/getChannelMetricsTableList.dto';
import { MetricsChannelSelect } from './constants/matricChannel.constant';
import { TMetricsChannelGetPayload } from './types/metricChannel.type';

@Controller('channels/:channelId/metrics/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MetricsChannelTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() dto: GetChannelMetricsTableListDto,
  ): Promise<IApiResultResponse<IMetricsTableListResponse<TMetricsChannelGetPayload>>> {
    const whereInput: Prisma.MetricChannelWhereInput = {
      channel: {
        id: channelId,
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
  async getTableCreate() {
    return {};
  }
}
