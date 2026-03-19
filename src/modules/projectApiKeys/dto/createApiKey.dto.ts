import { Type } from 'class-transformer';
import { IsString, IsDateString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  scope: string;

  @IsNotEmpty()
  @IsDateString()
  expiresAt: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  statusId: number;
}
