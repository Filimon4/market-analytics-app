import { Body, Controller, Get, Param, Patch, Query, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { GetApiKeyDto } from './dto/getApiKey.dto';
import { UpdateApiKeyDto } from './dto/updateApiKey.dto';
import { ProjectApiKeyService } from './projectApiKeys.service';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { ICreateEntityResponse } from 'src/common/interfaces/ientity.interface';
import { CreateApiKeyDto } from './dto/createApiKey.dto';

@Controller('api-keys')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectApiKeyController {
  constructor(
    private readonly apiKeyService: ProjectApiKeyService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('/statuses')
  async getApiKeyStatuses() {
    const apiKeyStatus = await this.prismaService.apiKeyStatus.findMany({
      select: {
        id: true,
        code: true,
      },
    });

    return { result: apiKeyStatus };
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.apiKeyService.getById(BigInt(id));
  }

  @Get()
  getList(@Query() dto: GetApiKeyDto) {
    return this.apiKeyService.getList(dto);
  }

  @Post()
  async createApiKey(
    @CurrentTenant() projectId: number,
    @Body() dto: CreateApiKeyDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const status = await this.prismaService.apiKeyStatus.findFirst({
      where: {
        code: dto.status.code,
      },
      select: {
        id: true,
      },
      take: 1,
    });

    const createApiKeyInput: Prisma.ApiKeyCreateInput = {
      project: {
        connect: {
          id: projectId,
        },
      },
      status: {
        connect: {
          id: status.id,
        },
      },
      name: dto.name,
      scope: dto.scope,
      expiresAt: dto.expiresAt,
    };

    const apiKey = await this.prismaService.apiKey.create({
      data: createApiKeyInput,
      select: {
        id: true,
      },
    });

    return {
      result: {
        id: apiKey.id.toString(),
      },
    };
  }

  @Patch()
  async updateApiKey(@Body() dto: UpdateApiKeyDto) {
    const updated = await this.apiKeyService.update(dto);

    return {
      result: {
        ...updated,
        id: updated.id.toString(),
      },
    };
  }
}
