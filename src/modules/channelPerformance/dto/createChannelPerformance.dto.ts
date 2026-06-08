import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateChannelPerformanceChannelDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class CreateChannelPerformanceDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChannelPerformanceChannelDto)
  channel: CreateChannelPerformanceChannelDto;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  spend?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  impressions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  clicks?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  conversions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  leads?: number;

  @IsOptional()
  @IsObject()
  ufMetrics?: Record<string, any>;
}
