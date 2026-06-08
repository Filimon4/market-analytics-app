import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ChannelPerformancesBlockDetails,
  ChannelPerformancesBlocks,
  ChannelPerformancesColumns,
  ChannelPerformancesSelect,
} from './constants/channelPerformance.constant';
import { GetChannelPerformancesTableListDto } from './dto/getChannelPerformancesTableList.dto';
import { TChannelPerformanceGetPayload } from './types/channelPerformance.type';

@Controller('channel-performances/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelPerformanceTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Body() dto: GetChannelPerformancesTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TChannelPerformanceGetPayload>>> {
    const whereInput: Prisma.ChannelPerformanceWhereInput = {
      channel: { strategy: { projectId } },
    };

    if (dto.filter?.channel) {
      whereInput.channelId = BigInt(dto.filter.channel.id);
    }

    if (dto.filter?.deleted !== undefined) {
      whereInput.deleted = dto.filter.deleted;
    }

    if (dto.filter?.startDate) {
      whereInput.startDate = {
        gte: dto.filter.startDate.from,
        lte: dto.filter.startDate.to,
      };
    }

    if (dto.filter?.createdAt) {
      whereInput.createdAt = {
        gte: dto.filter.createdAt.from,
        lte: dto.filter.createdAt.to,
      };
    }

    const total = await this.prismaService.channelPerformance.count({ where: whereInput });
    const data = await this.prismaService.channelPerformance.findMany({
      where: whereInput,
      select: ChannelPerformancesSelect,
      orderBy: { id: 'asc' },
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: ChannelPerformancesColumns,
        data,
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
        blocks: ChannelPerformancesBlocks,
        blockDetails: ChannelPerformancesBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('id') id: string,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const data = await this.prismaService.channelPerformance.findFirst({
      where: {
        id: BigInt(id),
        channel: { strategy: { projectId } },
      },
      select: ChannelPerformancesSelect,
    });

    if (!data) {
      throw new NotFoundException('Channel performance record not found');
    }

    return {
      result: {
        blocks: ChannelPerformancesBlocks,
        blockDetails: ChannelPerformancesBlockDetails,
        data: {
          ...data,
          channel: {
            ...data.channel,
            code: data.channel.name,
          },
        },
      },
    };
  }
}
