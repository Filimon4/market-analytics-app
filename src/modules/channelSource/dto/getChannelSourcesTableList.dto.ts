import { ITableColumnFilterDatetimePeriod } from '@src/common/interfaces/itable.interface';
import { IsDatetimePeriod } from '@src/common/utils/classValidator/IsDatetimePeriod';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class ChannelSourcesTableFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (value === '1' || value === 'true') return true;

    return false;
  })
  @IsBoolean()
  deleted?: boolean;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  createdAt?: ITableColumnFilterDatetimePeriod;
}

export class GetChannelSourcesTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ChannelSourcesTableFilterDto)
  filter: ChannelSourcesTableFilterDto = {};

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
