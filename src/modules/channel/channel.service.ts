import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/createChannel.dto';
import { PrismaService } from '@src/common/db/prisma.service';
import { UpdateChannelDto } from './dto/updateChannel.dto';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}
}
