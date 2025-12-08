import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsString()
  permissions: string;

  @IsDateString()
  expiresAt: string;

  @IsNumber()
  statusId: number;
}
