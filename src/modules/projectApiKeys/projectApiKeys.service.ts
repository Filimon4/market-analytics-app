import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/db/prisma.service.js';
import { UpdateApiKeyDto } from './dto/updateApiKey.dto.js';
import { GetApiKeyDto } from './dto/getApiKey.dto.js';

@Injectable()
export class ProjectApiKeyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: bigint) {
    const record = await this.prismaService.apiKey.findUnique({
      where: { id },
    });

    if (!record) throw new NotFoundException('API Key not found');

    return {
      ...record,
      id: record.id.toString(),
      createdBy: record.createdBy.toString(),
    };
  }

  async getList(dto: GetApiKeyDto) {
    const list = await this.prismaService.apiKey.findMany({
      where: {
        name: dto.search ? { contains: dto.search, mode: 'insensitive' } : undefined,
        statusId: dto.statusId ?? undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    return list.map((key) => ({
      ...key,
      id: key.id.toString(),
      createdBy: key.createdBy.toString(),
    }));
  }

  // TODO: After tenant id
  // @UseGuards(RoleGuard('2'))
  // async create(user: User, dto: CreateApiKeyDto) {
  //   const key = `api_${Date.now()}_${randomUUID()}`;

  //   const apiKey = await this.prismaService.apiKey.create({
  //     data: {
  //       name: dto.name,
  //       key: key,
  //       scope: dto.permissions,
  //       expiresAt: dto.expiresAt,
  //       project: {
  //         connect: {
  //           id:
  //         }
  //       },
  //       status: {
  //         connect: {
  //           id: dto.statusId,
  //         },
  //       },
  //     },
  //   });

  //   return {
  //     ...apiKey,
  //     id: apiKey.id.toString(),
  //     createdBy: apiKey.createdBy.toString(),
  //   };
  // }

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
    if (dto.expiresAt !== undefined) updateData.expiresAt = new Date(dto.expiresAt);
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
