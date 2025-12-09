import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto.js';
import { PrismaService } from '../../common/db/prisma.service.js';
import { UpdateChannelDto } from './dto/update-channel.dto.js';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChannelDto) {
    return this.prisma.channel.create({ data: dto });
  }

  async findAll() {
    return this.prisma.channel.findMany({ include: { strategy: true } });
  }

  async findOne(id: bigint) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: { strategy: true },
    });
    if (!channel) throw new NotFoundException('Channel not found');
    return channel;
  }

  async update(id: bigint, dto: UpdateChannelDto) {
    return this.prisma.channel.update({ where: { id }, data: dto });
  }

  async remove(id: bigint) {
    return this.prisma.channel.delete({ where: { id } });
  }
}
