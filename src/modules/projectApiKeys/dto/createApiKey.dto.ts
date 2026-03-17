import { Type } from 'class-transformer';
import { IsString, IsDateString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsString()
  permissions: string;

  @IsDateString()
  expiresAt: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  statusId: number;
}
