import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ChannelSourcesBlockDetails,
  ChannelSourcesBlocks,
  ChannelSourcesColumns,
  ChannelSourcesSelect,
} from './constants/channelSource.constant';
import { GetChannelSourcesTableListDto } from './dto/getChannelSourcesTableList.dto';
import { TChannelSourceGetPayload } from './types/channelSource.type';

@Controller('channel-sources/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelSourceTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @Body() dto: GetChannelSourcesTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TChannelSourceGetPayload>>> {
    const whereInput: Prisma.ChannelSourceWhereInput = {};

    if (dto.filter?.name) {
      whereInput.name = { contains: dto.filter.name, mode: 'insensitive' };
    }

    if (dto.filter?.deleted !== undefined) {
      whereInput.deleted = dto.filter.deleted;
    }

    if (dto.filter.createdAt) {
      whereInput.createdAt = {
        gte: dto.filter.createdAt.from,
        lte: dto.filter.createdAt.to,
      };
    }

    const total = await this.prismaService.channelSource.count({ where: whereInput, orderBy: { id: 'asc' } });
    const sourcesData = await this.prismaService.channelSource.findMany({
      select: ChannelSourcesSelect,
      orderBy: { id: 'asc' },
      where: whereInput,
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: ChannelSourcesColumns,
        data: sourcesData,
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
        blocks: ChannelSourcesBlocks,
        blockDetails: ChannelSourcesBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(@Param('id', ParseIntPipe) id: number): Promise<IApiResultResponse<IEntityResponse>> {
    const sourceData = await this.prismaService.channelSource.findUnique({
      where: { id },
      select: ChannelSourcesSelect,
    });

    if (!sourceData) {
      throw new NotFoundException('Channel source not found');
    }

    return {
      result: {
        blocks: ChannelSourcesBlocks,
        blockDetails: ChannelSourcesBlockDetails,
        data: sourceData,
      },
    };
  }
}
