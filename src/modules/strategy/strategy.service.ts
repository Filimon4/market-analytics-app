import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/common/db/prisma.service';
import { CreateStrategyDto } from './dto/createStrategy.dto';
import { UpdateStrategyDto } from './dto/updateStrategy.dto';

@Injectable()
export class StrategyService {
  constructor(private prismaService: PrismaService) {}

  async create(projectId: number, dto: CreateStrategyDto) {
    return this.prismaService.strategy.create({
      data: {
        projectId,
        name: dto.name,
        description: dto.description,
      },
      select: {
        id: true,
      },
    });
  }

  async list(projectId: number, includeDeleted = false) {
    return this.prismaService.strategy.findMany({
      where: {
        projectId,
        ...(includeDeleted ? {} : { deleted: false }),
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getById(projectId: number, strategyId: number) {
    const strategy = await this.prismaService.strategy.findFirst({
      where: {
        id: strategyId,
        projectId,
      },
    });

    if (!strategy) {
      throw new NotFoundException('Strategy not found');
    }

    return strategy;
  }

  async update(projectId: number, dto: UpdateStrategyDto) {
    const strategy = await this.getById(projectId, dto.id);

    if (strategy.deleted) {
      throw new BadRequestException('Cannot update deleted strategy');
    }

    await this.prismaService.strategy.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
        description: dto.description,
      },
      select: {
        id: true,
      },
    });
  }

  async delete(projectId: number, strategyId: number) {
    const strategy = await this.getById(projectId, strategyId);

    if (strategy.deleted) {
      throw new BadRequestException('The strategy already deleted');
    }

    await this.prismaService.strategy.update({
      where: {
        id: strategy.id,
      },
      data: {
        deleted: true,
      },
      select: {
        id: true,
      },
    });
  }

  async restore(projectId: number, strategyId: number) {
    const strategy = await this.getById(projectId, strategyId);

    if (!strategy.deleted) {
      throw new BadRequestException('The strategy is active');
    }

    await this.prismaService.strategy.update({
      where: {
        id: strategy.id,
      },
      data: {
        deleted: false,
      },
      select: {
        id: true,
      },
    });
  }
}
