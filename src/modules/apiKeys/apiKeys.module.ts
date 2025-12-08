import { Module } from '@nestjs/common';
import { ApiKeyController } from './apiKeys.controller.js';
import { ApiKeyService } from './apiKeys.service.js';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class ApiKeyModule {}
