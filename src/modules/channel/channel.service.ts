import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/createChannel.dto';
import { PrismaService } from '@src/common/db/prisma.service';
import { UpdateChannelDto } from './dto/updateChannel.dto';
import { ChannelPerformance, MetricChannel, Prisma } from '@prisma/client';
import { evaluate } from 'mathjs';
import { buildFormulaExpression } from '@src/shared/formula/formula.helpers';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: number, dto: CreateChannelDto) {
    const strategy = await this.prisma.strategy.findFirst({
      where: {
        id: dto.strategy.id,
        projectId,
        deleted: false,
      },
      select: {
        id: true,
      },
    });

    if (!strategy) {
      throw new NotFoundException('Strategy not found');
    }

    const trafficSource = await this.prisma.channelSource.findFirst({
      where: {
        id: dto.trafficSource.id,
        deleted: false,
      },
      select: {
        id: true,
      },
    });

    if (!trafficSource) {
      throw new NotFoundException('Traffic source not found');
    }

    return this.prisma.channel.create({
      data: {
        name: dto.name,
        strategy: {
          connect: {
            id: strategy.id,
          },
        },
        trafficSource: {
          connect: {
            id: trafficSource.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  async list(projectId: number, deleted = false) {
    return this.prisma.channel.findMany({
      where: {
        strategy: {
          projectId,
        },
        deleted,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getById(projectId: number, channelId: bigint) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id: channelId,
        strategy: {
          projectId,
        },
      },
      select: {
        id: true,
        name: true,
        deleted: true,
        createdAt: true,
        strategy: {
          select: {
            id: true,
            name: true,
          },
        },
        trafficSource: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    return channel;
  }

  async update(projectId: number, channelId: bigint, dto: UpdateChannelDto) {
    const channel = await this.getById(projectId, channelId);

    if (channel.deleted) {
      throw new BadRequestException('Cannot update deleted channel');
    }

    if (dto.strategy?.id) {
      const strategy = await this.prisma.strategy.findFirst({
        where: {
          id: dto.strategy.id,
          projectId,
          deleted: false,
        },
        select: {
          id: true,
        },
      });

      if (!strategy) {
        throw new NotFoundException('Strategy not found');
      }
    }

    if (dto.trafficSource?.id) {
      const trafficSource = await this.prisma.channelSource.findFirst({
        where: {
          id: dto.trafficSource.id,
          deleted: false,
        },
        select: {
          id: true,
        },
      });

      if (!trafficSource) {
        throw new NotFoundException('Traffic source not found');
      }
    }

    await this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        name: dto.name,
        strategy: dto.strategy?.id
          ? {
              connect: {
                id: dto.strategy.id,
              },
            }
          : undefined,
        trafficSource: dto.trafficSource?.id
          ? {
              connect: {
                id: dto.trafficSource.id,
              },
            }
          : undefined,
      },
      select: {
        id: true,
      },
    });
  }

  async delete(projectId: number, channelId: bigint) {
    const channel = await this.getById(projectId, channelId);

    if (channel.deleted) {
      throw new BadRequestException('The channel is already deleted');
    }

    await this.prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        deleted: true,
      },
      select: {
        id: true,
      },
    });
  }

  async restore(projectId: number, channelId: bigint) {
    const channel = await this.getById(projectId, channelId);

    if (!channel.deleted) {
      throw new BadRequestException('The channel is active');
    }

    await this.prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        deleted: false,
      },
      select: {
        id: true,
      },
    });
  }

  async updateMetrics(projectId: number, channelId: bigint) {
    const channelPerformances = await this.prisma.channelPerformance.findMany({
      where: {
        channel: {
          id: channelId,
          strategy: {
            projectId,
          },
        },
        deleted: false,
      },
      include: {
        channel: {
          include: {
            metricChannels: {
              where: { deleted: false },
            },
          },
        },
        channelPerformanceMetricResults: {
          include: {
            channelMetric: true,
          },
        },
        channelPerformanceUfChannelResults: {
          include: {
            ufChannel: true,
          },
        },
      },
    });

    for (const channelPerformance of channelPerformances) {
      for (const metric of channelPerformance.channel.metricChannels) {
        const data = {
          channelPerformanceId: channelPerformance.id,
          metricChannelId: metric.id,
          value: await this.calcChannelMetric(channelPerformance, metric),
        };

        await this.prisma.channelPerformanceMetricResult.upsert({
          where: {
            channelPerformanceId_metricChannelId: {
              metricChannelId: metric.id,
              channelPerformanceId: channelPerformance.id,
            },
          },
          update: {
            value: data.value,
          },
          create: data,
        });
      }
    }
  }

  private async calcChannelMetric(
    channelPerformance: Prisma.ChannelPerformanceGetPayload<{
      include: {
        channelPerformanceMetricResults: {
          include: {
            channelMetric: true;
          };
        };
        channelPerformanceUfChannelResults: {
          include: {
            ufChannel: true;
          };
        };
      };
    }>,
    metricChannel: Pick<MetricChannel, 'formula' | 'id'>,
  ) {
    if (!metricChannel.formula) return 0;

    const ufChannel = channelPerformance.channelPerformanceUfChannelResults.flatMap((cpu) => ({
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
        spend: channelPerformance.spend,
        impressions: channelPerformance.impressions,
        clicks: channelPerformance.clicks,
        conversions: channelPerformance.conversions,
        leads: channelPerformance.leads,
      },
    );

    return evaluate(buildFormulaExpression(JSON.parse(metricChannel.formula), ufChannelMap), scope) as number;
  }
}
