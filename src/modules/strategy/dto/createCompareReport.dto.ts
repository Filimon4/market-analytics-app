export class CreateCompareStrategyReportDto {
  reportConfiguration: {
    period: {
      startDate: string;
      endDate: string;
    } | null;
  };
  strategies: {
    strategyId: number;
    channelIds: number[];
    channels: {
      channelId: number;
      metricIds: string[];
      ufIds: string[];
    }[];
  }[];
}
