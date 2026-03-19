import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsFalse } from 'src/common/utils/classValidator/IsFalse';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  code: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  @IsFalse()
  default: boolean;
}
