import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { CreateStrategyDto } from './dto/createStrategy.dto.js';
import { UpdateStrategyDto } from './dto/updateStrategy.dto.js';
import { User } from 'src/common/decorators/user.decorator';
import type { User as UserType } from '@prisma/client';

@Controller('strategy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  create(@User() user: UserType, @Body() dto: CreateStrategyDto) {
    return this.strategyService.create(user, dto);
  }

  @Get()
  async findAll() {
    const list = await this.strategyService.findAll();

    return { list };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.strategyService.findOne(BigInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStrategyDto) {
    return this.strategyService.update(BigInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.strategyService.remove(BigInt(id));
  }
}
