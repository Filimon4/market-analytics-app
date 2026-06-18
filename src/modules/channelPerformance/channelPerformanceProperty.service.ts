import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@src/common/db/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdatePerformancePropertyDto } from './dtoProperty/updatePerformanceProperty.dto';

@Injectable()
export class ChannelPerformancePropertyService {
  private readonly logger = new Logger(ChannelPerformancePropertyService.name);

  constructor(private prisma: PrismaService) {}

  async update(channelId: bigint, id: bigint, dto: UpdatePerformancePropertyDto) {
    const dataChannelPerformance: Prisma.ChannelPerformanceUfChannelResultUpdateInput = {
      value: dto.value,
    };

    await this.prisma.channelPerformanceUfChannelResult.update({
      where: {
        channelPerformanceId_ufChannelId: {
          channelPerformanceId: channelId,
          ufChannelId: id,
        },
      },
      data: dataChannelPerformance,
      select: {
        ufChannelId: true,
      },
    });
  }
}
