import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

export class UsersToProjectTableRoleDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number
}

export class UsersToProjectTableListFilterDto {
  @IsOptional()
  @Transform(({value}) => value === '1' || value === 'true')
  @IsBoolean()
  blocked?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => UsersToProjectTableRoleDto)
  role?: UsersToProjectTableRoleDto;
  
  @IsOptional()
  @IsString()
  userName?: string;
  
  @IsOptional()
  @IsString()
  userEmail?: string;
}

export class GetUsersToProjectTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UsersToProjectTableListFilterDto)
  filter: UsersToProjectTableListFilterDto = {};

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  size: number = 10;
}