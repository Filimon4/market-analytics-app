import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateReportTypeDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsObject()
  configSchema: object;

  @IsNotEmpty()
  @IsObject()
  detailConfig: object;
}
