import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  strategyId: number;

  @IsNotEmpty()
  @IsString()
  trafficSource: string;
}
