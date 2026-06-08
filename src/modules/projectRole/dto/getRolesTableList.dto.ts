import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { toOptionalBoolean } from 'src/common/utils/transformers/to-boolean.transformer';

export class RolesTableFilterDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  default?: boolean;

  @IsOptional()
  @Transform(toOptionalBoolean)
  @IsBoolean()
  deleted?: boolean;
}

export class GetRolesTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => RolesTableFilterDto)
  filter: RolesTableFilterDto = {};

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
