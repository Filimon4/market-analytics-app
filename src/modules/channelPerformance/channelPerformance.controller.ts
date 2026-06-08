import { Controller } from '@nestjs/common';
import { ChannelPerformanceService } from './channelPerformance.service';

@Controller('channel-performances')
export class ChannelPerformanceController {
  constructor(private readonly service: ChannelPerformanceService) {}
}
