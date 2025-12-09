import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelPerformanceDto } from './createChannelPerformance.dto';

export class UpdateChannelPerformanceDto extends PartialType(
  CreateChannelPerformanceDto,
) {}
