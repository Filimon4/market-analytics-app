import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/db/prisma.service.js';
import { CreateApiKeyDto } from './dto/create-api-key.dto.js';
import { UpdateApiKeyDto } from './dto/update-api-key.dto.js';
import { GetApiKeyDto } from './dto/get-api-key.dto.js';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: bigint) {
    const record = await this.prismaService.apiKey.findUnique({
      where: { id },
      include: { creator: true, status: true },
    });

    if (!record) throw new NotFoundException('API Key not found');

    return record;
  }

  async getList(dto: GetApiKeyDto) {
    return this.prismaService.apiKey.findMany({
      where: {
        name: dto.search
          ? { contains: dto.search, mode: 'insensitive' }
          : undefined,
        statusId: dto.statusId ?? undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateApiKeyDto, createdBy: bigint) {
    const now = new Date();
    return await this.prismaService.apiKey.create({
      data: {
        name: dto.name,
        key: dto.key,
        permissions: dto.permissions,
        expiresAt: new Date(dto.expiresAt),
        statusId: dto.statusId,
        createdBy,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  async update(id: bigint, dto: UpdateApiKeyDto) {
    const updateData: {
      name?: string;
      permissions?: string;
      expiresAt?: Date;
      statusId?: number;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.permissions !== undefined) updateData.permissions = dto.permissions;
    if (dto.expiresAt !== undefined)
      updateData.expiresAt = new Date(dto.expiresAt);
    if (dto.statusId !== undefined) updateData.statusId = dto.statusId;

    return this.prismaService.apiKey.update({
      where: { id },
      data: updateData,
    });
  }

  validateKey(apiKey: string) {
    return this.prismaService.apiKey.findFirst({
      where: {
        key: apiKey,
        expiresAt: { gt: new Date() },
        status: {
          code: 'active',
        },
      },
    });
  }
}
