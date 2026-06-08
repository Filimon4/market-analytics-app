import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChannelsBlockDetails, ChannelsBlocks, ChannelsColumns, ChannelsSelect } from './constants/channel.constant';
import { GetChannelsTableListDto } from './dto/getChannelsTableList.dto';
import { TChannelGetPayload } from './types/channel.type';

@Controller('channels/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Body() dto: GetChannelsTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TChannelGetPayload>>> {
    const whereInput: Prisma.ChannelWhereInput = {
      strategy: {
        projectId,
      },
    };

    if (dto.filter?.name) {
      whereInput.name = { contains: dto.filter.name, mode: 'insensitive' };
    }

    if (dto.filter?.strategy) {
      whereInput.strategyId = dto.filter.strategy;
    }

    if (dto.filter?.trafficSource) {
      whereInput.trafficSourceId = dto.filter.trafficSource;
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

    const total = await this.prismaService.channel.count({ where: whereInput, orderBy: { id: 'asc' } });
    const channelsData = await this.prismaService.channel.findMany({
      where: whereInput,
      select: ChannelsSelect,
      orderBy: { id: 'asc' },
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: ChannelsColumns,
        data: channelsData,
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
        blocks: ChannelsBlocks,
        blockDetails: ChannelsBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('id') id: string,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const channelData = await this.prismaService.channel.findFirst({
      where: {
        id: BigInt(id),
        strategy: {
          projectId,
        },
      },
      select: ChannelsSelect,
    });

    if (!channelData) {
      throw new NotFoundException('Channel not found');
    }

    return {
      result: {
        blocks: ChannelsBlocks,
        blockDetails: ChannelsBlockDetails,
        data: {
          ...channelData,
          strategy: {
            ...channelData.strategy,
            code: channelData.strategy.name,
          },
          trafficSource: {
            ...channelData.trafficSource,
            code: channelData.trafficSource.name,
          },
        },
      },
    };
  }
}
