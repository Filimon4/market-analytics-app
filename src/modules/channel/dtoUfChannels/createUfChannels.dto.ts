import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUfChannelsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  required: boolean;
}
