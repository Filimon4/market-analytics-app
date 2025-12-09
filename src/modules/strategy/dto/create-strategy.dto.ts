import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStrategyDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ownerUserId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}
