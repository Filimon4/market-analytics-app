import { $Enums } from '@prisma/client';
import { ITableColumnFilterDatetimePeriod } from '@src/common/interfaces/itable.interface';
import { IsDatetimePeriod } from '@src/common/utils/classValidator/IsDatetimePeriod';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { toOptionalBoolean } from 'src/common/utils/transformers/to-boolean.transformer';

export class ReportsTableReportTypeFilterDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class ReportsTableFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReportsTableReportTypeFilterDto)
  reportType?: ReportsTableReportTypeFilterDto;

  @IsOptional()
  @IsIn(Object.values($Enums.ReportVisibility))
  visibility?: $Enums.ReportVisibility;

  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  deleted?: boolean;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  dateFrom?: ITableColumnFilterDatetimePeriod;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  dateTo?: ITableColumnFilterDatetimePeriod;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  createdAt?: ITableColumnFilterDatetimePeriod;
}

export class GetReportsTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ReportsTableFilterDto)
  filter: ReportsTableFilterDto = {};

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
