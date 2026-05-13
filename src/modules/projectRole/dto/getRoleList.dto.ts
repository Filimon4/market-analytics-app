import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';

export class GetRoleListFilter {
  @IsOptional()
  @IsString()
  likeTitle?: string;

  @IsOptional()
  @Type(() => Boolean)
  deleted?: boolean;
}

export class GetRoleList {
  @IsOptional()
  @ValidateNested()
  @Type(() => GetRoleListFilter)
  filter: GetRoleListFilter = {};

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
