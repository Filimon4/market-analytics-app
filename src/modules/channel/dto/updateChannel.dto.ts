import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateChannelStrategyDto, CreateChannelTrafficSourceDto } from './createChannel.dto';

export class UpdateChannelDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateChannelStrategyDto)
  @IsObject()
  strategy?: CreateChannelStrategyDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateChannelTrafficSourceDto)
  @IsObject()
  trafficSource?: CreateChannelTrafficSourceDto;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
