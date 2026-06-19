import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/common/db/prisma.service';
import { CreateChannelPerformanceDto } from './dto/createChannelPerformance.dto';
import { UpdateChannelPerformanceDto } from './dto/updateChannelPerformance.dto';
import { Prisma } from '@prisma/client';
import { buildFormulaExpression } from '@src/shared/formula/formula.helpers';
import { evaluate } from 'mathjs';

@Injectable()
export class ChannelPerformanceService {
  private readonly logger = new Logger(ChannelPerformanceService.name);

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

    const dataChannelPerformance: Prisma.ChannelPerformanceUpdateInput = {};

    if (dto.channel) {
      dataChannelPerformance.channel = {
        connect: {
          id: BigInt(dto.channel.id),
        },
      };
    }

    if (dto.clicks) {
      dataChannelPerformance.clicks = dto.clicks;
    }

    if (dto.conversions) {
      dataChannelPerformance.conversions = dto.conversions;
    }

    if (dto.endDate) {
      dataChannelPerformance.endDate = dto.endDate;
    }

    if (dto.startDate) {
      dataChannelPerformance.startDate = dto.startDate;
    }

    if (dto.spend) {
      dataChannelPerformance.spend = dto.spend;
    }

    if (dto.impressions) {
      dataChannelPerformance.impressions = dto.impressions;
    }

    if (dto.leads) {
      dataChannelPerformance.leads = dto.leads;
    }

    await this.prisma.channelPerformance.update({
      where: { id },
      data: dataChannelPerformance,
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

  async recalculateMetrics(projectId: number, id: bigint) {
    const record = await this.prisma.channelPerformance.findFirst({
      where: {
        id,
        channel: { strategy: { projectId } },
      },
      include: {
        channel: {
          include: {
            metricChannels: {
              where: { deleted: false },
            },
          },
        },
        channelPerformanceUfChannelResults: {
          include: {
            ufChannel: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Channel performance record not found');
    }

    if (record.deleted) {
      throw new ConflictException('Channel performsance was deleted');
    }

    const ufChannel = record.channelPerformanceUfChannelResults.flatMap((cpu) => ({
      ...cpu.ufChannel,
      value: cpu.value,
    }));
    const ufChannelMap = ufChannel.reduce((acc, uf) => {
      acc.set(uf.id, uf);
      return acc;
    }, new Map());
    const scope: Record<string, any> = ufChannel.reduce(
      (acc, uf) => {
        acc[uf.name] = uf.value;
        return acc;
      },
      {
        spend: record.spend,
        impressions: record.impressions,
        clicks: record.clicks,
        conversions: record.conversions,
        leads: record.leads,
      },
    );

    // TODO: Новые метрики не будут добавлятся
    for (const metric of record.channel.metricChannels) {
      const resultValue = metric.formula
        ? (evaluate(buildFormulaExpression(JSON.parse(metric.formula), ufChannelMap), scope) as number)
        : 0;

      await this.prisma.channelPerformanceMetricResult.upsert({
        where: {
          channelPerformanceId_metricChannelId: {
            channelPerformanceId: id,
            metricChannelId: metric.id,
          },
        },
        create: {
          channelPerformanceId: id,
          metricChannelId: metric.id,
          value: resultValue,
        },
        update: {
          value: resultValue,
        },
      });
    }
  }

  async updateUf(projectId: number, id: bigint) {
    const record = await this.prisma.channelPerformance.findFirst({
      where: {
        id,
        channel: { strategy: { projectId } },
      },
      select: {
        id: true,
        deleted: true,
        channelId: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Channel performance record not found');
    }

    if (record.deleted) {
      throw new ConflictException('Channel performance was deleted');
    }

    const ufChannels = await this.prisma.ufChannel.findMany({
      where: {
        channelId: record.channelId,
        deleted: false,
      },
      select: { id: true },
    });

    for (const ufChannel of ufChannels) {
      await this.prisma.channelPerformanceUfChannelResult.upsert({
        where: {
          channelPerformanceId_ufChannelId: {
            channelPerformanceId: id,
            ufChannelId: ufChannel.id,
          },
        },
        create: {
          channelPerformanceId: id,
          ufChannelId: ufChannel.id,
          value: Prisma.JsonNull,
        },
        update: {},
      });
    }
  }
}
