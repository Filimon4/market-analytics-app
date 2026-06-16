import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMetricsChannelDto } from './dtoMetrics/createMetricsChannel.dto';
import { PrismaService } from '@src/common/db/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateMetricsChannelDto } from './dtoMetrics/updateMetricsChannel.dto';

@Injectable()
export class MetricsChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(channelId: bigint, dto: CreateMetricsChannelDto) {
    const createData: Prisma.MetricChannelCreateInput = {
      code: dto.code,
      name: dto.name,
      formula: JSON.stringify(dto.formula),
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

    if (dto.code) {
      metricChannelData.code = dto.code;
    }

    if (dto.formula) {
      metricChannelData.formula = JSON.stringify(dto.formula);
    }

    if (dto.name) {
      metricChannelData.name = dto.name;
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.metricChannel.update({
        where: {
          id: metricChannelId,
          channel: {
            id: channelId,
          },
        },
        data: metricChannelData,
        select: {
          id: true,
        },
      });

      if (dto.formula) {
        const formulaValues = dto.formula.map((item) => item.value);

        const matchedUfChannels = await tx.ufChannel.findMany({
          where: {
            channelId,
            code: { in: formulaValues },
          },
          select: { id: true },
        });

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
