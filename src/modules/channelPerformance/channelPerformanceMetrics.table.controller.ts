import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IListEntityTableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetChannelPerformancesTableListDto } from './dto/getChannelPerformancesTableList.dto';

@Controller('channel-performances/:channelId/metrics/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelPerformanceMetricsTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: number,
    @Body() dto: GetChannelPerformancesTableListDto,
  ): Promise<IApiResultResponse<IListEntityTableListResponse<{}>>> {
    const whereInput: Prisma.ChannelPerformanceMetricResultWhereInput = {
      channelPerformanceId: channelId,
      channelMetric: {
        deleted: false,
      },
    };

    const total = await this.prismaService.channelPerformanceMetricResult.count({ where: whereInput });
    const data = await this.prismaService.channelPerformanceMetricResult.findMany({
      where: whereInput,
      select: {
        value: true,
        channelMetric: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        data: data.map((d) => ({
          value: d.value,
          name: d.channelMetric.name,
          code: d.channelMetric.code,
        })),
        page: dto.page,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }
}
