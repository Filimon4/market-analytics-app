import { CreateMetricsChannelDto } from './createMetricsChannel.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMetricsChannelDto extends PartialType(CreateMetricsChannelDto) {}
