import { ITableColumnFilterDatetimePeriod } from '@src/common/interfaces/itable.interface';
import { IsDatetimePeriod } from '@src/common/utils/classValidator/IsDatetimePeriod';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { toOptionalBoolean } from 'src/common/utils/transformers/to-boolean.transformer';

export class CreateChannelPerformanceChannelDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class ChannelPerformancesTableFilterDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateChannelPerformanceChannelDto)
  channel: CreateChannelPerformanceChannelDto;

  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  deleted?: boolean;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  startDate?: ITableColumnFilterDatetimePeriod;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  createdAt?: ITableColumnFilterDatetimePeriod;
}

export class GetChannelPerformancesTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ChannelPerformancesTableFilterDto)
  filter: ChannelPerformancesTableFilterDto;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  size: number = 10;
}
