import { ApiHideProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { IsBigInt } from "src/common/utils/classValidator/IsBigInt";
import { MinFilledProperties } from "src/common/utils/classValidator/minFilledProperties";

export class GetProjectDto {
  @IsOptional()
  @Type(() => BigInt)
  @IsBigInt()
  userToProjectId?: bigint

  @ApiHideProperty()
  @MinFilledProperties(1)
  _minFilledProperties?: never
}