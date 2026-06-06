import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateChannelPerformanceDto } from './dto/createChannelPerformance.dto';
import { UpdateChannelPerformanceDto } from './dto/updateChannelPerformance.dto';

@Injectable()
export class ChannelPerformanceService {
  constructor(private prisma: PrismaService) {}
}
