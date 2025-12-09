import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/createChannel.dto.js';
import { PrismaService } from '../../common/db/prisma.service.js';
import { UpdateChannelDto } from './dto/updateChannel.dto.js';
import { User } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChannelDto) {
    const channel = await this.prisma.channel.create({
      data: {
        trafficSource: dto.trafficSource,
        strategy: {
          connect: {
            id: dto.strategyId,
          },
        },
      },
    });

    console.log(channel);

    return {
      ...channel,
      id: channel.id.toString(),
      strategyId: channel.strategyId.toString(),
    };
  }

  async findAll() {
    const list = await this.prisma.channel.findMany({
      include: { strategy: true },
    });

    console.log(list);

    return list.map((channel) => ({
      ...channel,
      id: channel.id.toString(),
      strategyId: channel.strategyId.toString(),
      strategy: {
        ...channel.strategy,
        id: channel.strategy.id.toString(),
        ownerUserId: channel.strategy.ownerUserId.toString(),
      },
    }));
  }

  async findOne(id: bigint) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: { strategy: true },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    return {
      ...channel,
      id: channel.id.toString(),
      strategyId: channel.strategyId.toString(),
      strategy: {
        ...channel.strategy,
        id: channel.strategy.id.toString(),
        ownerUserId: channel.strategy.ownerUserId.toString(),
      },
    };
  }

  async update(id: bigint, dto: UpdateChannelDto) {
    return this.prisma.channel.update({ where: { id }, data: dto });
  }

  async remove(id: bigint) {
    return this.prisma.channel.delete({ where: { id } });
  }
}
