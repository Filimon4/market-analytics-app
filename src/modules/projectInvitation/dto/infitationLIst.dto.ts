import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class InvitationFilterDto {
  @IsOptional()
  @IsIn(Object.values($Enums.InvitationStatus))
  status?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class InvitationListDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => InvitationFilterDto)
  filter: InvitationFilterDto = {};

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
