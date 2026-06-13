import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { IEntityResponse } from '@src/common/interfaces/ientity.interface';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { PrismaService } from '@src/common/db/prisma.service';
import { UfChannelsBlockDetails, UfChannelsBlocks, UfChannelsSelect } from './constants/ufChannel.constant';
import { Prisma } from '@prisma/client';
import { IListEntityTableListResponse } from '@src/common/interfaces/itable.interface';
import { GetUfChannelsTableListDto } from './dtoUfChannels/getUfChannelsTableList.dto';
import { TUfChannelsGetPayload } from './types/ufChannels.type';

@Controller({ path: 'channels/:channelId/uf-channels/table', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class UfChannelsTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Body() dto: GetUfChannelsTableListDto,
  ): Promise<IApiResultResponse<IListEntityTableListResponse<TUfChannelsGetPayload>>> {
    const whereInput: Prisma.UfChannelWhereInput = {
      channel: {
        id: BigInt(channelId),
      },
    };

    const total = await this.prismaService.ufChannel.count({ where: whereInput, orderBy: { id: 'asc' } });
    const ufChannelsData = await this.prismaService.ufChannel.findMany({
      where: whereInput,
      select: UfChannelsSelect,
      orderBy: { id: 'asc' },
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        data: ufChannelsData,
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
        blocks: UfChannelsBlocks,
        blockDetails: UfChannelsBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Param('id') id: string,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const channelData = await this.prismaService.ufChannel.findFirst({
      where: {
        id: BigInt(id),
        channel: {
          id: BigInt(channelId),
        },
      },
      select: UfChannelsSelect,
    });

    if (!channelData) {
      throw new NotFoundException('Uf Channel not found');
    }

    // TODO FEATURE: добавить удаление и востановелние. Динамически

    return {
      result: {
        blocks: UfChannelsBlocks,
        blockDetails: UfChannelsBlockDetails,
        data: {
          ...channelData,
        },
      },
    };
  }
}
