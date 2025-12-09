import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStrategyDto } from './dto/create-strategy.dto.js';
import { UpdateStrategyDto } from './dto/update-strategy.dto.js';
import { PrismaService } from '../../common/db/prisma.service.js';

@Injectable()
export class StrategyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStrategyDto) {
    return this.prisma.strategy.create({ data: dto });
  }

  async findAll() {
    return this.prisma.strategy.findMany({
      include: { channels: true, owner: true },
    });
  }

  async findOne(id: bigint) {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id },
      include: { channels: true, owner: true },
    });
    if (!strategy) throw new NotFoundException('Strategy not found');
    return strategy;
  }

  async update(id: bigint, dto: UpdateStrategyDto) {
    return this.prisma.strategy.update({ where: { id }, data: dto });
  }

  async remove(id: bigint) {
    return this.prisma.strategy.delete({ where: { id } });
  }
}
