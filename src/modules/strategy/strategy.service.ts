import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/common/db/prisma.service';
import { CreateStrategyDto } from './dto/createStrategy.dto';
import { UpdateStrategyDto } from './dto/updateStrategy.dto';
import { Prisma } from '@prisma/client';
import { GetStrategyStatisticsDto } from './dto/getStrategyStatistics.dto';

@Injectable()
export class StrategyService {
  constructor(private prismaService: PrismaService) {}

  async create(projectId: number, dto: CreateStrategyDto) {
    return this.prismaService.strategy.create({
      data: {
        projectId,
        name: dto.name,
        description: dto.description,
      },
      select: {
        id: true,
      },
    });
  }

  async list(projectId: number, includeDeleted = false) {
    return this.prismaService.strategy.findMany({
      where: {
        projectId,
        ...(includeDeleted ? {} : { deleted: false }),
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getById(projectId: number, strategyId: number) {
    const strategy = await this.prismaService.strategy.findFirst({
      where: {
        id: strategyId,
        projectId,
      },
    });

    if (!strategy) {
      throw new NotFoundException('Strategy not found');
    }

    return strategy;
  }

  async getStatistics(projectId: number, strategyId: number, dto: GetStrategyStatisticsDto) {
    const strategy = await this.getById(projectId, strategyId);
    const from = dto.from ? new Date(dto.from) : undefined;
    const to = dto.to ? new Date(dto.to) : undefined;

    if (from && to && from > to) {
      throw new BadRequestException('The "from" date must be less than or equal to "to" date');
    }

    const strategyWhere: Prisma.StrategyWhereInput = {
      id: strategy.id,
      projectId,
    };
    const channelWhere: Prisma.ChannelWhereInput = {
      strategyId: strategy.id,
      strategy: strategyWhere,
    };
    const activeChannelWhere: Prisma.ChannelWhereInput = {
      ...channelWhere,
      deleted: false,
    };
    const performanceWhere: Prisma.ChannelPerformanceWhereInput = {
      channel: activeChannelWhere,
    };
    const activePerformanceWhere: Prisma.ChannelPerformanceWhereInput = {
      ...performanceWhere,
      deleted: false,
      ...(from || to
        ? {
            AND: [
              ...(to
                ? [
                    {
                      startDate: {
                        lte: to,
                      },
                    },
                  ]
                : []),
              ...(from
                ? [
                    {
                      endDate: {
                        gte: from,
                      },
                    },
                  ]
                : []),
            ],
          }
        : {}),
    };

    const [
      channelsTotal,
      channelsActive,
      channelsDeleted,
      performancesTotal,
      performancesActive,
      performancesDeleted,
      performanceTotals,
      performanceDates,
    ] = await this.prismaService.$transaction([
      this.prismaService.channel.count({ where: channelWhere }),
      this.prismaService.channel.count({ where: activeChannelWhere }),
      this.prismaService.channel.count({ where: { ...channelWhere, deleted: true } }),
      this.prismaService.channelPerformance.count({ where: performanceWhere }),
      this.prismaService.channelPerformance.count({ where: activePerformanceWhere }),
      this.prismaService.channelPerformance.count({ where: { ...performanceWhere, deleted: true } }),
      this.prismaService.channelPerformance.aggregate({
        where: activePerformanceWhere,
        _sum: {
          spend: true,
          impressions: true,
          clicks: true,
          conversions: true,
          leads: true,
        },
      }),
      this.prismaService.channelPerformance.aggregate({
        where: activePerformanceWhere,
        _min: {
          startDate: true,
        },
        _max: {
          endDate: true,
        },
      }),
    ]);

    const spend = performanceTotals._sum.spend ?? 0;
    const impressions = performanceTotals._sum.impressions ?? 0;
    const clicks = performanceTotals._sum.clicks ?? 0;
    const conversions = performanceTotals._sum.conversions ?? 0;
    const leads = performanceTotals._sum.leads ?? 0;

    return {
      strategy: {
        id: strategy.id,
        name: strategy.name,
        deleted: strategy.deleted,
      },
      channels: {
        total: channelsTotal,
        active: channelsActive,
        deleted: channelsDeleted,
      },
      performanceRecords: {
        total: performancesTotal,
        active: performancesActive,
        deleted: performancesDeleted,
        filter: {
          from: from?.toISOString() ?? null,
          to: to?.toISOString() ?? null,
        },
        period: {
          startDate: performanceDates._min.startDate,
          endDate: performanceDates._max.endDate,
        },
      },
      totals: {
        spend,
        impressions,
        clicks,
        conversions,
        leads,
      },
    };
  }

  async update(projectId: number, dto: UpdateStrategyDto) {
    const strategy = await this.getById(projectId, dto.id);

    if (strategy.deleted) {
      throw new BadRequestException('Cannot update deleted strategy');
    }

    await this.prismaService.strategy.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
        description: dto.description,
      },
      select: {
        id: true,
      },
    });
  }

  async delete(projectId: number, strategyId: number) {
    const strategy = await this.getById(projectId, strategyId);

    if (strategy.deleted) {
      throw new BadRequestException('The strategy already deleted');
    }

    await this.prismaService.strategy.update({
      where: {
        id: strategy.id,
      },
      data: {
        deleted: true,
      },
      select: {
        id: true,
      },
    });
  }

  async restore(projectId: number, strategyId: number) {
    const strategy = await this.getById(projectId, strategyId);

    if (!strategy.deleted) {
      throw new BadRequestException('The strategy is active');
    }

    await this.prismaService.strategy.update({
      where: {
        id: strategy.id,
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
