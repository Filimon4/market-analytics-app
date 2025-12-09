import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service.js';
import { StrategyController } from './strategy.controller.js';

@Module({
  controllers: [StrategyController],
  providers: [StrategyService],
})
export class StrategyModule {}
