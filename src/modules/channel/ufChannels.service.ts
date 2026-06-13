import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/common/db/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUfChannelsDto } from './dtoUfChannels/createUfChannels.dto';
import { UpdateUfChannelsDto } from './dtoUfChannels/updateUfChannels.dto';

@Injectable()
export class UfChannelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(channelId: bigint, dto: CreateUfChannelsDto) {
    const createData: Prisma.UfChannelCreateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type,
      required: dto.required,
      channel: {
        connect: {
          id: channelId,
        },
      },
      deleted: false,
    };

    return this.prismaService.ufChannel.create({
      data: createData,
      select: {
        id: true,
      },
    });
  }

  async update(channelId: bigint, ufChannelId: bigint, dto: UpdateUfChannelsDto) {
    const ufChannel = await this.getById(channelId, ufChannelId);

    if (ufChannel.deleted) {
      throw new BadRequestException('Cannot update deleted metric channel');
    }

    const updateData: Prisma.UfChannelUpdateInput = {};

    if (dto.code) {
      updateData.code = dto.code;
    }

    if (dto.type) {
      updateData.type = dto.type;
    }

    if (dto.name) {
      updateData.name = dto.name;
    }

    if (dto.value) {
      updateData.value = dto.value;
    }

    if (dto.required) {
      updateData.required = dto.required;
    }

    await this.prismaService.ufChannel.update({
      where: {
        id: ufChannelId,
        channel: {
          id: channelId,
        },
      },
      data: updateData,
      select: {
        id: true,
      },
    });
  }

  delete(channelId: bigint, id: bigint) {
    return this.prismaService.ufChannel.update({
      where: {
        id,
        channelId,
      },
      data: {
        deleted: true,
      },
    });
  }

  restore(channelId: bigint, id: bigint) {
    return this.prismaService.ufChannel.update({
      where: {
        id,
        channelId,
      },
      data: {
        deleted: false,
      },
    });
  }

  private async getById(channelId: bigint, id: bigint) {
    return this.prismaService.ufChannel.findFirst({
      where: {
        id: id,
        channel: {
          id: channelId,
        },
      },
    });
  }
}
