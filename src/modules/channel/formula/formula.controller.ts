import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';
import { ChannelPerformanceOperators, DefaultOperators } from './constants/operators';
import { PrismaService } from '@src/common/db/prisma.service';
import { FormulaPaletteItem } from '@src/modules/channel/formula/formula.helpers';

@Controller({ path: 'channels/metrics/:metricId/formulas', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class FormulaController {
  constructor(protected readonly prismaService: PrismaService) {}

  @Get()
  async getOperators(@Param('metricId') metricId: string) {
    const groups = [
      {
        label: 'Стандартные операции',
        key: 'defaults',
        color: '#224F7A',
        children: DefaultOperators.map(
          (item: Omit<FormulaPaletteItem, 'fType'>) =>
            ({
              ...item,
              fType: 'operator',
            }) as FormulaPaletteItem,
        ),
      },
      {
        label: 'Поля канала трафика',
        key: 'channelPerformanceOperators',
        color: '#B269FF',
        children: ChannelPerformanceOperators.map(
          (item: Omit<FormulaPaletteItem, 'fType'>) =>
            ({
              ...item,
              fType: 'builtin',
            }) as FormulaPaletteItem,
        ),
      },
    ];

    const ufChannel = await this.prismaService.metricChannel.findUnique({
      where: {
        id: BigInt(metricId),
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        channel: {
          include: {
            ufChannels: true,
          },
        },
      },
    });

    if (ufChannel) {
      groups.push({
        label: 'Свойства канала трафика',
        key: 'properties',
        color: '#FFB269',
        children: ufChannel.channel.ufChannels.map((uf) => ({
          label: uf.name,
          value: String(uf.id),
          fType: 'uf-channel',
        })),
      });
    }

    return {
      result: groups,
    };
  }
}
