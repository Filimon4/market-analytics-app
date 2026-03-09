import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { TRoleGetPayload } from "../types";

export class GetRolesTableListDto {
  @IsOptional()
  filter: Partial<TRoleGetPayload> = {}

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