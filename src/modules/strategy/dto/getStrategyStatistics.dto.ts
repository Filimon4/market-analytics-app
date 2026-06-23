import { IsDateString, IsOptional } from 'class-validator';

export class GetStrategyStatisticsDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
