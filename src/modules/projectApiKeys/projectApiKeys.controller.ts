import { Body, Controller, Get, Param, Patch, Query, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { GetApiKeyDto } from './dto/getApiKey.dto';
import { UpdateApiKeyDto } from './dto/updateApiKey.dto';
import { ProjectApiKeyService } from './projectApiKeys.service';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { TProjectApiKeysResponse } from './types';
import { ApiKeysBlockDetails, ApiKeysBlocks, ApiKeysColumns, ApiKeysSelect } from './constants';
import { GetApiKeysTableListDto } from './dto/getApiKeysTableList';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { IEntity } from 'src/common/interfaces/ientity.interface';

@Controller('project/api-keys')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectApiKeyController {
  constructor(
    private readonly apiKeyService: ProjectApiKeyService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.apiKeyService.getById(BigInt(id));
  }

  @Get()
  getList(@Query() dto: GetApiKeyDto) {
    return this.apiKeyService.getList(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateApiKeyDto) {
    return this.apiKeyService.update(BigInt(id), dto);
  }

  @Post('/table/list')
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
        code: {
          contains: dto.filter.status,
        },
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

  @Get('table/create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntity, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: ApiKeysBlocks,
        blockDetails: ApiKeysBlockDetails,
      },
    };
  }

  @Get('/table/:id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('id', ParseIntPipe) apiKeyId: number,
  ): Promise<IApiResultResponse<IEntity>> {
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
