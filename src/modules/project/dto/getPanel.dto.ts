import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class GetPanelDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  roleId: number
}