import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeysBlockDetails, ApiKeysBlocks, ApiKeysColumns, ApiKeysSelect } from './constants';
import { GetApiKeysTableListDto } from './dto/getApiKeysTableList';
import { TProjectApiKeysResponse } from './types';

@Controller('api-keys/table/')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectApiKeyTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Body() dto: GetApiKeysTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TProjectApiKeysResponse>>> {
    const whereApiKeyInput: Prisma.ApiKeyWhereInput = {
      projectId: projectId,
    };

    if (dto.filter.key) {
      whereApiKeyInput.key = { contains: dto.filter.key };
    }

    if (dto.filter.name) {
      whereApiKeyInput.name = { contains: dto.filter.name };
    }

    if (dto.filter.scope) {
      whereApiKeyInput.scope = { contains: dto.filter.scope };
    }

    if (dto.filter.status) {
      whereApiKeyInput.status = {
        id: dto.filter.status,
      };
    }

    if (dto.filter.expiresAt) {
      whereApiKeyInput.expiresAt = {
        gte: dto.filter.expiresAt.from,
        lte: dto.filter.expiresAt.to,
      };
    }

    if (dto.filter.createdAt) {
      whereApiKeyInput.createdAt = {
        gte: dto.filter.createdAt.from,
        lte: dto.filter.createdAt.to,
      };
    }

    const total = await this.prismaService.apiKey.count({ where: whereApiKeyInput, orderBy: { id: 'asc' } });
    const dataApiKeys = await this.prismaService.apiKey.findMany({
      where: whereApiKeyInput,
      select: ApiKeysSelect,
      orderBy: { id: 'asc' },
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: ApiKeysColumns,
        data: dataApiKeys.map((key) => ({ ...key, id: key.id.toString() })),
        page: 0,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  @Get('create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: ApiKeysBlocks,
        blockDetails: ApiKeysBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('id', ParseIntPipe) apiKeyId: number,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const rolesWhereInput: Prisma.ApiKeyWhereUniqueInput = {
      projectId,
      id: apiKeyId,
    };

    const apiKeyData = await this.prismaService.apiKey.findUnique({
      where: rolesWhereInput,
      select: ApiKeysSelect,
    });

    return {
      result: {
        blocks: ApiKeysBlocks,
        blockDetails: ApiKeysBlockDetails,
        data: {
          ...apiKeyData,
          id: apiKeyData.id.toString(),
        },
      },
    };
  }
}
