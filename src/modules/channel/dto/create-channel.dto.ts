export class CreateChannelDto {
  strategy_id: number;
  period_start: Date;
  period_end: Date;
  traffic_source: string;
  budget_spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  created_at: Date;
  updated_at: Date;
}
