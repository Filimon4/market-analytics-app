import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator"

export class ApiKeysTableFilterDto {
  @IsOptional()
  @IsString()
  name?: string
  
  @IsOptional()
  @IsString()
  key?: string
  
  @IsOptional()
  @IsString()
  scope?: string
  
  @IsOptional()
  status?: string
}

export class GetApiKeysTableListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ApiKeysTableFilterDto)
  filter: ApiKeysTableFilterDto = {}

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