import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMetricsChannelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  formula: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
