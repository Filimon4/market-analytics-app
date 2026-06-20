import { ITableColumnFilterDatetimePeriod } from '@src/common/interfaces/itable.interface';
import { IsDatetimePeriod } from '@src/common/utils/classValidator/IsDatetimePeriod';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class ReportTypesTableFilterDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  createdAt?: ITableColumnFilterDatetimePeriod;
}

export class GetReportTypesTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ReportTypesTableFilterDto)
  filter: ReportTypesTableFilterDto = {};

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
