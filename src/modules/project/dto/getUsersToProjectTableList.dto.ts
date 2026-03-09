import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { TUsersToProjectRequest } from "../types/user.interface";

export class GetUsersToProjectTableListDto {
  @IsOptional()
  @Transform((param) => {
    return JSON.parse(param.value)
  })
  filter: Partial<TUsersToProjectRequest> = {}

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