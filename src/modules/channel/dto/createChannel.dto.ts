import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator';

export class CreateChannelStrategyDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class CreateChannelTrafficSourceDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class CreateChannelDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChannelStrategyDto)
  @IsObject()
  strategy: CreateChannelStrategyDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChannelTrafficSourceDto)
  @IsObject()
  trafficSource: CreateChannelTrafficSourceDto;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
