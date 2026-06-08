import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateChannelSourceDto } from './dto/createChannelSource.dto';
import { UpdateChannelSourceDto } from './dto/updateChannelSource.dto';

@Injectable()
export class ChannelSourceService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateChannelSourceDto) {
    return this.prismaService.channelSource.create({
      data: {
        name: dto.name,
      },
      select: {
        id: true,
      },
    });
  }

  async getById(id: number) {
    const channelSource = await this.prismaService.channelSource.findUnique({
      where: { id },
    });

    if (!channelSource) {
      throw new NotFoundException('Channel source not found');
    }

    return channelSource;
  }

  async list(includeDeleted = false) {
    return this.prismaService.channelSource.findMany({
      where: includeDeleted ? undefined : { deleted: false },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(dto: UpdateChannelSourceDto) {
    const channelSource = await this.getById(dto.id);

    if (channelSource.deleted) {
      throw new BadRequestException('Cannot update deleted channel source');
    }

    return this.prismaService.channelSource.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
      },
      select: {
        id: true,
      },
    });
  }

  async delete(id: number) {
    const channelSource = await this.getById(id);

    if (channelSource.deleted) {
      throw new BadRequestException('The channel source is already deleted');
    }

    await this.prismaService.channelSource.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
      select: {
        id: true,
      },
    });
  }

  async restore(id: number) {
    const channelSource = await this.getById(id);

    if (!channelSource.deleted) {
      throw new BadRequestException('The channel source is active');
    }

    await this.prismaService.channelSource.update({
      where: {
        id,
      },
      data: {
        deleted: false,
      },
      select: {
        id: true,
      },
    });
  }
}
