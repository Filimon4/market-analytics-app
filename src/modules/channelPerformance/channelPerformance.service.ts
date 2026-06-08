import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/common/db/prisma.service';
import { CreateChannelPerformanceDto } from './dto/createChannelPerformance.dto';
import { UpdateChannelPerformanceDto } from './dto/updateChannelPerformance.dto';

@Injectable()
export class ChannelPerformanceService {
  constructor(private prisma: PrismaService) {}

  private async resolveChannel(projectId: number, channelId: number) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id: BigInt(channelId),
        strategy: { projectId },
        deleted: false,
      },
      select: { id: true },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async create(projectId: number, dto: CreateChannelPerformanceDto) {
    await this.resolveChannel(projectId, Number(dto.channel.id));

    return this.prisma.channelPerformance.create({
      data: {
        channelId: BigInt(dto.channel.id),
        startDate: dto.startDate,
        endDate: dto.endDate,
        spend: dto.spend ?? 0,
        impressions: dto.impressions ?? 0,
        clicks: dto.clicks ?? 0,
        conversions: dto.conversions ?? 0,
        leads: dto.leads ?? 0,
        ufMetrics: dto.ufMetrics ?? {},
      },
      select: { id: true },
    });
  }

  async list(projectId: number, includeDeleted = false) {
    return this.prisma.channelPerformance.findMany({
      where: {
        channel: { strategy: { projectId } },
        ...(includeDeleted ? {} : { deleted: false }),
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        spend: true,
        impressions: true,
        clicks: true,
        conversions: true,
        leads: true,
        createdAt: true,
        deleted: true,
        channel: {
          select: { id: true, name: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async getById(projectId: number, id: bigint) {
    const record = await this.prisma.channelPerformance.findFirst({
      where: {
        id,
        channel: { strategy: { projectId } },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        spend: true,
        impressions: true,
        clicks: true,
        conversions: true,
        leads: true,
        ufMetrics: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        channel: {
          select: { id: true, name: true },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Channel performance record not found');
    }

    return record;
  }

  async update(projectId: number, id: bigint, dto: UpdateChannelPerformanceDto) {
    const record = await this.getById(projectId, id);

    if (record.deleted) {
      throw new BadRequestException('Cannot update deleted channel performance record');
    }

    if (dto.channel !== undefined) {
      await this.resolveChannel(projectId, Number(dto.channel.id));
    }

    await this.prisma.channelPerformance.update({
      where: { id },
      data: {
        ...(dto.channel !== undefined ? { channelId: BigInt(dto.channel.id) } : {}),
        ...(dto.startDate !== undefined ? { startDate: dto.startDate } : {}),
        ...(dto.endDate !== undefined ? { endDate: dto.endDate } : {}),
        ...(dto.spend !== undefined ? { spend: dto.spend } : {}),
        ...(dto.impressions !== undefined ? { impressions: dto.impressions } : {}),
        ...(dto.clicks !== undefined ? { clicks: dto.clicks } : {}),
        ...(dto.conversions !== undefined ? { conversions: dto.conversions } : {}),
        ...(dto.leads !== undefined ? { leads: dto.leads } : {}),
        ...(dto.ufMetrics !== undefined ? { ufMetrics: dto.ufMetrics } : {}),
      },
      select: { id: true },
    });
  }

  async delete(projectId: number, id: bigint) {
    const record = await this.getById(projectId, id);

    if (record.deleted) {
      throw new BadRequestException('The channel performance record is already deleted');
    }

    await this.prisma.channelPerformance.update({
      where: { id },
      data: { deleted: true },
      select: { id: true },
    });
  }

  async restore(projectId: number, id: bigint) {
    const record = await this.getById(projectId, id);

    if (!record.deleted) {
      throw new BadRequestException('The channel performance record is active');
    }

    await this.prisma.channelPerformance.update({
      where: { id },
      data: { deleted: false },
      select: { id: true },
    });
  }
}
