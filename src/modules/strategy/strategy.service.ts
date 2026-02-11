import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStrategyDto } from './dto/createStrategy.dto.js';
import { UpdateStrategyDto } from './dto/updateStrategy.dto.js';
import { PrismaService } from '../../common/db/prisma.service.js';
import { User } from '@prisma/client';

@Injectable()
export class StrategyService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, dto: CreateStrategyDto) {
    const strategy = await this.prisma.strategy.create({
      data: {
        description: dto.description,
        name: dto.name,
        project: {
          connect: {
            id: dto.projectId,
          },
        },
      },
    });

    return {
      ...strategy,
      id: strategy.id.toString(),
      projectId: strategy.projectId.toString()
    };
  }

  async findAll() {
    const list = await this.prisma.strategy.findMany();

    return list.map((str) => ({
      ...str,
      id: str.id.toString(),
      projectId: str.projectId.toString(),
    }));
  }

  async findOne(id: bigint) {
    const strategy = await this.prisma.strategy.findUnique({
      where: { id },
    });

    if (!strategy) throw new NotFoundException('Strategy not found');

    return {
      ...strategy,
      id: strategy.id.toString(),
      projectId: strategy.projectId.toString(),
    };
  }

  async update(id: bigint, dto: UpdateStrategyDto) {
    return this.prisma.strategy.update({ where: { id }, data: dto });
  }

  async remove(id: bigint) {
    return this.prisma.strategy.delete({ where: { id } });
  }
}
