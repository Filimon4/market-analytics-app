import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { ITableColumnFilterDatetimePeriod } from 'src/common/interfaces/itable.interface';
import { IsDatetimePeriod } from 'src/common/utils/classValidator/IsDatetimePeriod';

export class ApiKeysTableFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  expiresAt?: ITableColumnFilterDatetimePeriod;

  @IsOptional()
  @ValidateNested()
  @IsDatetimePeriod()
  createdAt?: ITableColumnFilterDatetimePeriod;
}

export class GetApiKeysTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ApiKeysTableFilterDto)
  filter: ApiKeysTableFilterDto = {};

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
