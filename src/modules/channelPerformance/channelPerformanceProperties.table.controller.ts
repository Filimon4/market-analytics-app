import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IListEntityTableListResponse } from 'src/common/interfaces/itable.interface';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetChannelPerformancesTableListDto } from './dto/getChannelPerformancesTableList.dto';
import { IEntityResponse } from '@src/common/interfaces/ientity.interface';
import {
  ChannelPerformancePropertiesBlockDetails,
  ChannelPerformancePropertiesBlocks,
} from './constants/channelPerformanceProperties.constant';

@Controller('channel-performances/:channelId/properties/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelPerformancePropertiesTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @Param('channelId') channelId: number,
    @Body() dto: GetChannelPerformancesTableListDto,
  ): Promise<IApiResultResponse<IListEntityTableListResponse<{}>>> {
    const whereInput: Prisma.ChannelPerformanceUfChannelResultWhereInput = {
      channelPerformanceId: channelId,
    };

    const total = await this.prismaService.channelPerformanceUfChannelResult.count({ where: whereInput });
    const data = await this.prismaService.channelPerformanceUfChannelResult.findMany({
      where: whereInput,
      select: {
        value: true,
        ufChannel: {
          select: {
            id: true,
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
          id: d.ufChannel.id,
          value: d.value,
          name: d.ufChannel.name,
          code: d.ufChannel.code,
        })),
        page: dto.page,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @Param('channelId') channelId: string,
    @Param('id') id: string,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const channelData = await this.prismaService.channelPerformanceUfChannelResult.findUnique({
      where: {
        channelPerformanceId_ufChannelId: {
          channelPerformanceId: BigInt(channelId),
          ufChannelId: BigInt(id),
        },
      },
      select: {
        ufChannel: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        value: true,
      },
    });

    if (!channelData) {
      throw new NotFoundException('Uf Channel not found');
    }

    return {
      result: {
        blocks: ChannelPerformancePropertiesBlocks,
        blockDetails: ChannelPerformancePropertiesBlockDetails,
        data: {
          id: channelData.ufChannel.id,
          value: channelData.value,
          name: channelData.ufChannel.name,
          code: channelData.ufChannel.code,
        },
      },
    };
  }
}
