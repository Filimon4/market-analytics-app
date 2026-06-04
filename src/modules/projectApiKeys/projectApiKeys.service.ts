import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/db/prisma.service';
import { UpdateApiKeyDto } from './dto/updateApiKey.dto';
import { GetApiKeyDto } from './dto/getApiKey.dto';

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
    }));
  }

  // TODO: After tenant id. Проверить все права и т.п.
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

  async update(dto: UpdateApiKeyDto) {
    const updateData: Prisma.ApiKeyUpdateInput = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.scope) updateData.scope = dto.scope;
    if (dto.expiresAt) updateData.expiresAt = new Date(dto.expiresAt);
    if (dto.status) {
      updateData.status = { connect: { id: dto.status.id } };
    }

    return this.prismaService.apiKey.update({
      where: { id: BigInt(dto.id) },
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
