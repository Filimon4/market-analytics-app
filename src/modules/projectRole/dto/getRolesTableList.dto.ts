import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

export class RolesTableFilterDto {
  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @Transform(({value}) => {
    if (!value) return undefined
    if (value === '1' || value === 'true') return true

    return false
  })
  @IsBoolean()
  default?: boolean
}

export class GetRolesTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => RolesTableFilterDto)
  filter: RolesTableFilterDto = {}

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  size: number = 10
}