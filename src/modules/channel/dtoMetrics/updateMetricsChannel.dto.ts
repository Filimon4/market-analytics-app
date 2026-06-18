import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateMetricsChannelDto } from './createMetricsChannel.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMetricsChannelDto extends PartialType(CreateMetricsChannelDto) {
  @IsNotEmpty()
  @IsArray()
  formula: { label: string; value: string }[];
}
