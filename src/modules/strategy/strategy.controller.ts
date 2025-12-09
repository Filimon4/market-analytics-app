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
import { CreateStrategyDto } from './dto/create-strategy.dto.js';
import { UpdateStrategyDto } from './dto/update-strategy.dto.js';

@Controller('strategy')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  create(@Body() dto: CreateStrategyDto) {
    return this.strategyService.create(dto);
  }

  @Get()
  findAll() {
    return this.strategyService.findAll();
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
