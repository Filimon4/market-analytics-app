import { $Enums } from '@prisma/client';
import { IsBigInt } from '@src/common/utils/classValidator/IsBigInt';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateReportTypeDto {
  @IsNotEmpty()
  @Type(() => BigInt)
  @IsBigInt()
  id: bigint;
}

export class CreateReportVisibilityDto {
  @IsNotEmpty()
  @IsIn(Object.values($Enums.ReportVisibility))
  code: $Enums.ReportVisibility;
}

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateFrom: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateTo: Date;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateReportVisibilityDto)
  visibility?: CreateReportVisibilityDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateReportTypeDto)
  reportType: CreateReportTypeDto;
}
