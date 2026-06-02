import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UpdateUserAccountDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateUserAccountDto)
  user: UpdateUserAccountDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateUserRoleDto)
  userRole: UpdateUserRoleDto;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  blocked: boolean;
}
