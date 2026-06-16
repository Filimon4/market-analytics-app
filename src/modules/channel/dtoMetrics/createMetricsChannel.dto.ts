import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMetricsChannelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsArray()
  formula: { label: string; value: string }[];

  @IsNotEmpty()
  @IsString()
  code: string;
}
