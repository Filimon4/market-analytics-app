import { Type } from 'class-transformer';
import { IsArray, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateCompareStrategyReportPeriodDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}

class CreateCompareStrategyReportConfigurationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCompareStrategyReportPeriodDto)
  period?: CreateCompareStrategyReportPeriodDto | null;
}

class CreateCompareStrategyReportChannelDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  channelId: number;

  @IsArray()
  @IsString({ each: true })
  metricIds: string[];

  @IsArray()
  @IsString({ each: true })
  ufIds: string[];
}

class CreateCompareStrategyReportStrategyDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  strategyId: number;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  channelIds: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompareStrategyReportChannelDto)
  channels: CreateCompareStrategyReportChannelDto[];
}

export class CreateCompareStrategyReportDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateCompareStrategyReportConfigurationDto)
  reportConfiguration: CreateCompareStrategyReportConfigurationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompareStrategyReportStrategyDto)
  strategies: CreateCompareStrategyReportStrategyDto[];
}
