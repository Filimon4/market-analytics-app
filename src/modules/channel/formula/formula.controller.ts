import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';
import { ChannelPerformanceOperators, DefaultOperators } from './constants/operators';
import { PrismaService } from '@src/common/db/prisma.service';

@Controller({ path: 'channels/:channelId/formulas', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class FormulaController {
  constructor(protected readonly prismaService: PrismaService) {}

  @Get()
  async getOperators(@Param('channelId') channelId: string) {
    const groups = [
      {
        label: 'Стандартные операции',
        key: 'defaults',
        color: '#224F7A',
        children: DefaultOperators,
      },
      {
        label: 'Поля канала трафика',
        key: 'channelPerformanceOperators',
        color: '#B269FF',
        children: ChannelPerformanceOperators,
      },
    ];

    const ufChannel = await this.prismaService.ufChannel.findMany({
      where: {
        channelId: BigInt(channelId),
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    if (ufChannel.length) {
      groups.push({
        label: 'Свойства канала трафика',
        key: 'properties',
        color: '#FFB269',
        children: ufChannel.map((uf) => ({
          label: uf.name,
          value: uf.code,
        })),
      });
    }

    return {
      result: groups,
    };
  }
}
