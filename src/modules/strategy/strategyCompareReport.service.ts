import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, User as UserDB } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { CreateCompareStrategyReportDto } from '@src/modules/strategy/dto/createCompareReport.dto';
import {
  CompareReportChannel,
  CompareReportMetricChannel,
  CompareReportPeriod,
  CompareReportRequestedChannel,
} from '@src/modules/strategy/types/compareReport.type';
import { buildFormulaExpression } from '@src/shared/formula/formula.helpers';
import type { NormalizedFormulaItem } from '@src/shared/formula/formula.helpers';
import Big from 'big.js';
import { createHash, randomUUID } from 'crypto';
import { evaluate } from 'mathjs';

@Injectable()
export class StrategyCompareReportService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(projectId: bigint, reportId: bigint) {
    const report = await this.prismaService.report.findFirst({
      where: {
        id: reportId,
        projectId,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        dateFrom: true,
        dateTo: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        config: true,
        createdById: true,
        projectId: true,
        reportResults: {
          select: {
            id: true,
            reportId: true,
            paramsHash: true,
            createdAt: true,
            expiresAt: true,
            isStale: true,
            rows: {
              select: {
                id: true,
                reportResultId: true,
                rowIndex: true,
                data: true,
              },
              orderBy: {
                rowIndex: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Compare report not found');
    }

    return this.serializeCompareReport(report);
  }

  async create(projectId: bigint, user: UserDB, dto: CreateCompareStrategyReportDto) {
    const period = this.resolveCompareReportPeriod(dto);
    const requestedChannels = this.resolveCompareReportRequestedChannels(dto);

    if (!requestedChannels.length) {
      throw new BadRequestException('At least one channel is required to create compare report');
    }

    const strategyIds = [
      ...new Set(
        dto.strategies.map((strategy) => this.toCompareReportBigInt(strategy.strategyId, 'strategyId').toString()),
      ),
    ].map((id) => this.toCompareReportBigInt(id, 'strategyId'));
    const channelIds = requestedChannels.map((channel) => channel.channelId);
    const metricIds = [
      ...new Set(requestedChannels.flatMap((channel) => channel.metricIds.map((id) => id.toString()))),
    ].map((id) => BigInt(id));
    const ufIds = [...new Set(requestedChannels.flatMap((channel) => channel.ufIds.map((id) => id.toString())))].map(
      (id) => BigInt(id),
    );

    const [membership, strategies, channels] = await Promise.all([
      this.prismaService.userToProject.findFirst({
        where: {
          userId: user.id,
          projectId,
        },
        select: {
          id: true,
        },
      }),
      this.prismaService.strategy.findMany({
        where: {
          id: {
            in: strategyIds,
          },
          projectId,
          deleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      }),
      this.getCompareReportChannels(projectId, channelIds, metricIds, ufIds, period),
    ]);

    if (!membership) {
      throw new NotFoundException('Project membership not found');
    }

    if (strategies.length !== strategyIds.length) {
      throw new NotFoundException('Strategy not found');
    }

    const channelMap = new Map(channels.map((channel) => [channel.id.toString(), channel]));

    this.validateCompareReportChannels(requestedChannels, channelMap);

    const rows = requestedChannels.map((requestedChannel) => {
      const channel = channelMap.get(requestedChannel.channelId.toString());

      if (!channel) {
        throw new NotFoundException('Channel not found');
      }

      return this.buildCompareReportRow(channel, requestedChannel, period);
    });
    const config = this.buildCompareReportConfig(dto, period);
    const paramsHash = createHash('sha256').update(JSON.stringify(config)).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const dateFrom = period.from;
    const dateTo = period.to;

    return this.prismaService.$transaction(async (trx) => {
      const report = await trx.report.create({
        data: {
          name: `Strategies compare report ${new Date().toISOString()}`,
          slug: randomUUID(),
          dateFrom,
          dateTo,
          config,
          project: {
            connect: {
              id: projectId,
            },
          },
          createdBy: {
            connect: {
              id: membership.id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          dateFrom: true,
          dateTo: true,
          visibility: true,
          createdAt: true,
          updatedAt: true,
          deleted: true,
          config: true,
          createdById: true,
          projectId: true,
        },
      });
      const reportResult = await trx.reportResult.create({
        data: {
          reportId: report.id,
          paramsHash,
          expiresAt,
        },
        select: {
          id: true,
          reportId: true,
          paramsHash: true,
          createdAt: true,
          expiresAt: true,
          isStale: true,
        },
      });

      await trx.reportResultRow.createMany({
        data: rows.map((row, rowIndex) => ({
          reportResultId: reportResult.id,
          rowIndex,
          data: row,
        })),
      });
      const reportRows = await trx.reportResultRow.findMany({
        where: {
          reportResultId: reportResult.id,
        },
        select: {
          id: true,
          reportResultId: true,
          rowIndex: true,
          data: true,
        },
        orderBy: {
          rowIndex: 'asc',
        },
      });

      return this.serializeCompareReport({
        ...report,
        reportResults: [
          {
            ...reportResult,
            rows: reportRows,
          },
        ],
      });
    });
  }

  private serializeCompareReport(
    report: Prisma.ReportGetPayload<{
      select: {
        id: true;
        name: true;
        slug: true;
        dateFrom: true;
        dateTo: true;
        visibility: true;
        createdAt: true;
        updatedAt: true;
        deleted: true;
        config: true;
        createdById: true;
        projectId: true;
        reportResults: {
          select: {
            id: true;
            reportId: true;
            paramsHash: true;
            createdAt: true;
            expiresAt: true;
            isStale: true;
            rows: {
              select: {
                id: true;
                reportResultId: true;
                rowIndex: true;
                data: true;
              };
            };
          };
        };
      };
    }>,
  ) {
    return {
      ...report,
      id: report.id.toString(),
      createdById: report.createdById.toString(),
      projectId: report.projectId.toString(),
      reportResults: report.reportResults.map((reportResult) => ({
        ...reportResult,
        id: reportResult.id.toString(),
        reportId: reportResult.reportId.toString(),
        rows: reportResult.rows.map((row) => ({
          ...row,
          id: row.id.toString(),
          reportResultId: row.reportResultId.toString(),
        })),
      })),
    };
  }

  private resolveCompareReportPeriod(dto: CreateCompareStrategyReportDto): CompareReportPeriod {
    const period = dto.reportConfiguration.period;
    const from = period?.startDate ? new Date(period.startDate) : null;
    const to = period?.endDate ? new Date(period.endDate) : null;

    if ((from && Number.isNaN(from.getTime())) || (to && Number.isNaN(to.getTime()))) {
      throw new BadRequestException('Invalid compare report period');
    }

    if (from && to && from > to) {
      throw new BadRequestException('The "startDate" date must be less than or equal to "endDate" date');
    }

    return { from, to };
  }

  private resolveCompareReportRequestedChannels(dto: CreateCompareStrategyReportDto): CompareReportRequestedChannel[] {
    return dto.strategies.flatMap((strategy) => {
      const channelConfigMap = new Map(strategy.channels.map((channel) => [channel.channelId, channel]));
      const channelIds = [...new Set([...strategy.channelIds, ...channelConfigMap.keys()])];

      return channelIds.map((channelId) => {
        const channelConfig = channelConfigMap.get(channelId);

        return {
          strategyId: this.toCompareReportBigInt(strategy.strategyId, 'strategyId'),
          channelId: this.toCompareReportBigInt(channelId, 'channelId'),
          metricIds: (channelConfig?.metricIds ?? []).map((id) => this.toCompareReportBigInt(id, 'metricIds')),
          ufIds: (channelConfig?.ufIds ?? []).map((id) => this.toCompareReportBigInt(id, 'ufIds')),
        };
      });
    });
  }

  private getCompareReportChannels(
    projectId: bigint,
    channelIds: bigint[],
    metricIds: bigint[],
    ufIds: bigint[],
    period: CompareReportPeriod,
  ): Promise<CompareReportChannel[]> {
    return this.prismaService.channel.findMany({
      where: {
        id: {
          in: channelIds,
        },
        deleted: false,
        strategy: {
          projectId,
          deleted: false,
        },
      },
      select: {
        id: true,
        name: true,
        strategyId: true,
        strategy: {
          select: {
            id: true,
            name: true,
          },
        },
        ufChannels: {
          where: {
            id: {
              in: ufIds,
            },
            deleted: false,
          },
          select: {
            id: true,
            name: true,
          },
        },
        metricChannels: {
          where: {
            id: {
              in: metricIds,
            },
            deleted: false,
          },
          select: {
            id: true,
            name: true,
            formula: true,
          },
        },
        channelPerformances: {
          where: {
            deleted: false,
            ...(period.from || period.to
              ? {
                  AND: [
                    ...(period.to
                      ? [
                          {
                            startDate: {
                              lte: period.to,
                            },
                          },
                        ]
                      : []),
                    ...(period.from
                      ? [
                          {
                            endDate: {
                              gte: period.from,
                            },
                          },
                        ]
                      : []),
                  ],
                }
              : {}),
          },
          select: {
            spend: true,
            impressions: true,
            clicks: true,
            leads: true,
            channelPerformanceUfChannelResults: {
              where: {
                ufChannelId: {
                  in: ufIds,
                },
              },
              select: {
                ufChannelId: true,
                value: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  private validateCompareReportChannels(
    requestedChannels: CompareReportRequestedChannel[],
    channelMap: Map<string, CompareReportChannel>,
  ) {
    for (const requestedChannel of requestedChannels) {
      const channel = channelMap.get(requestedChannel.channelId.toString());

      if (!channel || channel.strategyId !== requestedChannel.strategyId) {
        throw new NotFoundException('Channel not found');
      }

      const metricIds = new Set(channel.metricChannels.map((metric) => metric.id.toString()));
      const ufIds = new Set(channel.ufChannels.map((uf) => uf.id.toString()));

      if (requestedChannel.metricIds.some((metricId) => !metricIds.has(metricId.toString()))) {
        throw new NotFoundException('Metric not found');
      }

      if (requestedChannel.ufIds.some((ufId) => !ufIds.has(ufId.toString()))) {
        throw new NotFoundException('UF channel not found');
      }
    }
  }

  private buildCompareReportConfig(
    dto: CreateCompareStrategyReportDto,
    period: CompareReportPeriod,
  ): Prisma.InputJsonObject {
    return {
      type: 'strategyCompare',
      reportConfiguration: {
        period: {
          startDate: period.from?.toISOString() ?? null,
          endDate: period.to?.toISOString() ?? null,
        },
      },
      strategies: dto.strategies.map((strategy) => ({
        strategyId: strategy.strategyId,
        channelIds: strategy.channelIds,
        channels: strategy.channels.map((channel) => ({
          channelId: channel.channelId,
          metricIds: channel.metricIds,
          ufIds: channel.ufIds,
        })),
      })),
    };
  }

  private buildCompareReportRow(
    channel: CompareReportChannel,
    requestedChannel: CompareReportRequestedChannel,
    period: CompareReportPeriod,
  ): Prisma.InputJsonObject {
    const totals = channel.channelPerformances.reduce(
      (acc, performance) => ({
        spend: acc.spend + performance.spend,
        impressions: acc.impressions + performance.impressions,
        clicks: acc.clicks + performance.clicks,
        leads: acc.leads + performance.leads,
      }),
      {
        spend: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
      },
    );
    const ufValues = requestedChannel.ufIds.map((ufId) => {
      const ufChannel = channel.ufChannels.find((uf) => uf.id === ufId);
      const value = channel.channelPerformances.reduce((sum, performance) => {
        const result = performance.channelPerformanceUfChannelResults.find((ufResult) => ufResult.ufChannelId === ufId);

        return sum + this.toCompareReportNumber(result?.value ?? null);
      }, 0);

      return {
        id: ufId.toString(),
        name: ufChannel?.name ?? '',
        value: Number(new Big(value).toFixed(2)),
      };
    });
    const scope = ufValues.reduce<Record<string, number>>(
      (acc, uf) => ({
        ...acc,
        [uf.name]: uf.value,
      }),
      {
        spend: Number(new Big(totals.spend).toFixed(2)),
        impressions: totals.impressions,
        clicks: totals.clicks,
        leads: totals.leads,
      },
    );
    const ufChannelMap = new Map(
      ufValues.map((uf) => [
        BigInt(uf.id),
        {
          value: String(uf.value),
        },
      ]),
    );
    const metrics = requestedChannel.metricIds.map((metricId) => {
      const metric = channel.metricChannels.find((channelMetric) => channelMetric.id === metricId);

      return {
        id: metricId.toString(),
        name: metric?.name ?? '',
        value: metric ? this.calculateCompareReportMetric(metric, scope, ufChannelMap) : null,
      };
    });

    return {
      strategy: {
        id: channel.strategy.id.toString(),
        name: channel.strategy.name,
      },
      channel: {
        id: channel.id.toString(),
        name: channel.name,
      },
      period: {
        startDate: period.from?.toISOString() ?? null,
        endDate: period.to?.toISOString() ?? null,
      },
      totals: {
        spend: Number(new Big(totals.spend).toFixed(2)),
        impressions: totals.impressions,
        clicks: totals.clicks,
        leads: totals.leads,
      },
      uf: ufValues,
      metrics,
    };
  }

  private calculateCompareReportMetric(
    metric: CompareReportMetricChannel,
    scope: Record<string, number>,
    ufChannelMap: Map<bigint, { value: string }>,
  ): number | null {
    if (!metric.formula) {
      return 0;
    }

    const formulaItems = JSON.parse(metric.formula) as NormalizedFormulaItem[];

    if (!formulaItems.length) {
      return 0;
    }

    try {
      const expression = buildFormulaExpression(formulaItems, ufChannelMap);

      return Number(new Big(String(evaluate(expression, scope))).toFixed(2));
    } catch (_error) {
      return null;
    }
  }

  private toCompareReportNumber(value: Prisma.JsonValue | null): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const numericValue = Number(value);

      return Number.isFinite(numericValue) ? numericValue : 0;
    }

    return 0;
  }

  private toCompareReportBigInt(value: number | string, fieldName: string): bigint {
    try {
      return BigInt(value);
    } catch (_error) {
      throw new BadRequestException(`Invalid ${fieldName} value`);
    }
  }
}
