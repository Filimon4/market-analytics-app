import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class GetApiKeyDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  statusId?: number;
}
