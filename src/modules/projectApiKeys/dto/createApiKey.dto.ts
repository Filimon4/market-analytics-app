import { Type } from 'class-transformer';
import { IsString, IsDateString, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

export class CreateApiKeyStatusDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

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
  @ValidateNested()
  @Type(() => CreateApiKeyStatusDto)
  status: CreateApiKeyStatusDto;
}
