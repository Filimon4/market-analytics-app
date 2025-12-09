import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateChannelPerformanceDto } from './dto/createChannelPerformance.dto';
import { UpdateChannelPerformanceDto } from './dto/updateChannelPerformance.dto';

@Injectable()
export class ChannelPerformanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChannelPerformanceDto) {
    const chnlPer = await this.prisma.channelPerformance.create({ data: dto });

    return {
      ...chnlPer,
      id: chnlPer.id.toString(),
      channelId: chnlPer.channelId.toString(),
    };
  }

  async findAll() {
    const list = await this.prisma.channelPerformance.findMany({
      include: { channel: true },
    });

    return list.map((chnlPer) => ({
      ...chnlPer,
      id: chnlPer.id.toString(),
      channelId: chnlPer.channelId.toString(),
      channel: {
        ...chnlPer.channel,
        id: chnlPer.channel.id.toString(),
        strategyId: chnlPer.channel.strategyId.toString(),
      },
    }));
  }

  async findOne(id: string) {
    const chnlPer = await this.prisma.channelPerformance.findUnique({
      where: { id },
      include: { channel: true },
    });

    if (!chnlPer) throw new NotFoundException('ChannelPerformance not found');

    return {
      ...chnlPer,
      id: chnlPer.id.toString(),
      channelId: chnlPer.channelId.toString(),
      channel: {
        ...chnlPer.channel,
        id: chnlPer.channel.id.toString(),
        strategyId: chnlPer.channel.strategyId.toString(),
      },
    };
  }

  async update(id: string, dto: UpdateChannelPerformanceDto) {
    return this.prisma.channelPerformance.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.channelPerformance.delete({ where: { id } });
  }
}
