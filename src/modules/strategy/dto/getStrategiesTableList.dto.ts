import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { ITableColumnFilterDatetimePeriod } from 'src/common/interfaces/itable.interface';
import { IsDatetimePeriod } from 'src/common/utils/classValidator/IsDatetimePeriod';
import { toOptionalBoolean } from 'src/common/utils/transformers/to-boolean.transformer';

export class StrategiesTableFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  deleted?: boolean;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  createdAt?: ITableColumnFilterDatetimePeriod;
}

export class GetStrategiesTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => StrategiesTableFilterDto)
  filter: StrategiesTableFilterDto = {};

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
