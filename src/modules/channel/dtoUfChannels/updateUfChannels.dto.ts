import { PartialType } from '@nestjs/mapped-types';
import { CreateUfChannelsDto } from './createUfChannels.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUfChannelsDto extends PartialType(CreateUfChannelsDto) {
  @IsNotEmpty()
  @IsString()
  value: string;
}
