import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateChannelPerformanceDto {
  @IsNotEmpty()
  @Type(() => BigInt)
  @IsNumber()
  @IsPositive()
  channelId: bigint;

  @IsString()
  @IsNotEmpty()
  name: string;

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
  impressions?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  clicks?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  spend?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  conversions?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  revenue?: number = 0;
}
