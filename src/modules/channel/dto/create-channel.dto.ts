import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  strategyId: number;

  @IsNotEmpty()
  @Type(() => String)
  @IsDate()
  periodStart: Date;

  @IsNotEmpty()
  @Type(() => String)
  @IsDate()
  periodEnd: Date;

  @IsNotEmpty()
  @IsString()
  trafficSource: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  budgetSpent: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  impressions: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  clicks: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  leads: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  conversions: number;
}
