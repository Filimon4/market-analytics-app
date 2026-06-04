import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDateString, IsNotEmpty, ValidateNested, IsObject } from 'class-validator';

export class UpdateApiKeyStatusDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class UpdateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateApiKeyStatusDto)
  @IsObject()
  status?: UpdateApiKeyStatusDto;
}
