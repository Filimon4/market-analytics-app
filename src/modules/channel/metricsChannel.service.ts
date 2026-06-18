import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMetricsChannelDto } from './dtoMetrics/createMetricsChannel.dto';
import { PrismaService } from '@src/common/db/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateMetricsChannelDto } from './dtoMetrics/updateMetricsChannel.dto';
import { NormalizedFormulaItem, normalizeFormulaItems } from '@src/modules/channel/formula/formula.helpers';

@Injectable()
export class MetricsChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(channelId: bigint, dto: CreateMetricsChannelDto) {
    const createData: Prisma.MetricChannelCreateInput = {
      name: dto.name,
      channel: {
        connect: {
          id: channelId,
        },
      },
      deleted: false,
    };

    return this.prismaService.metricChannel.create({
      data: createData,
      select: {
        id: true,
      },
    });
  }

  async update(channelId: bigint, metricChannelId: bigint, dto: UpdateMetricsChannelDto) {
    const metricChannel = await this.getById(channelId, metricChannelId);

    if (metricChannel.deleted) {
      throw new BadRequestException('Cannot update deleted metric channel');
    }

    const metricChannelData: Prisma.MetricChannelUpdateInput = {};

    if (dto.formula) {
      metricChannelData.formula = JSON.stringify(normalizeFormulaItems(dto.formula));
    }

    if (dto.name) {
      metricChannelData.name = dto.name;
    }

    await this.prismaService.$transaction(async (tx) => {
      const savedMetric = await tx.metricChannel.update({
        where: {
          id: metricChannelId,
          channel: {
            id: channelId,
          },
        },
        data: metricChannelData,
        select: {
          id: true,
          formula: true,
        },
      });

      if (savedMetric.formula) {
        const formulaValues = JSON.parse(savedMetric.formula) as NormalizedFormulaItem[];

        const ufChannels = await tx.ufChannel.findMany({
          where: {
            channelId,
          },
        });

        const matchedUfChannels = ufChannels.filter((uf) =>
          formulaValues
            .filter((form) => form.fType === 'uf-channel')
            .map((form) => form.ufChannelId)
            .includes(String(uf.id)),
        );

        await tx.metricToUfChannel.deleteMany({
          where: { metricId: metricChannelId },
        });

        if (matchedUfChannels.length > 0) {
          await tx.metricToUfChannel.createMany({
            data: matchedUfChannels.map((uf) => ({
              metricId: metricChannelId,
              ufChannelId: uf.id,
            })),
          });
        }
      }
    });
  }

  delete(channelId: bigint, metricChannelId: bigint) {
    return this.prismaService.metricChannel.update({
      where: {
        id: metricChannelId,
        channelId,
      },
      data: {
        deleted: true,
      },
    });
  }

  restore(channelId: bigint, metricChannelId: bigint) {
    return this.prismaService.metricChannel.update({
      where: {
        id: metricChannelId,
        channelId,
      },
      data: {
        deleted: false,
      },
    });
  }

  private async getById(channelId: bigint, id: bigint) {
    return this.prismaService.metricChannel.findFirst({
      where: {
        id: id,
        channel: {
          id: channelId,
        },
      },
    });
  }
}
