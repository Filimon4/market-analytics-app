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
      formula: dto.formula,
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
      metricChannelData.formula = dto.formula;
    }

    if (dto.name) {
      metricChannelData.name = dto.name;
    }

    await this.prismaService.metricChannel.update({
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
