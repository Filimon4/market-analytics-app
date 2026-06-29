import type { Prisma } from '@prisma/client';

export interface CompareReportRequestedChannel {
  strategyId: bigint;
  channelId: bigint;
  metricIds: bigint[];
  ufIds: bigint[];
}

export interface CompareReportPeriod {
  from: Date | null;
  to: Date | null;
}

export interface CompareReportStrategy {
  id: bigint;
  name: string;
}

export interface CompareReportUfChannel {
  id: bigint;
  name: string;
}

export interface CompareReportMetricChannel {
  id: bigint;
  name: string;
  formula: string;
}

export interface CompareReportUfResult {
  ufChannelId: bigint;
  value: Prisma.JsonValue | null;
}

export interface CompareReportPerformance {
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  channelPerformanceUfChannelResults: CompareReportUfResult[];
}

export interface CompareReportChannel {
  id: bigint;
  name: string;
  strategyId: bigint;
  strategy: CompareReportStrategy;
  ufChannels: CompareReportUfChannel[];
  metricChannels: CompareReportMetricChannel[];
  channelPerformances: CompareReportPerformance[];
}
