import { Module } from '@nestjs/common';
import { ProjectApiKeyController } from './projectApiKeys.controller.js';
import { ProjectApiKeyService } from './projectApiKeys.service.js';

@Module({
  controllers: [ProjectApiKeyController],
  providers: [ProjectApiKeyService],
})
export class ProjectApiKeyModule {}
