import { Module } from '@nestjs/common';
import { ProjectApiKeyController } from './projectApiKeys.controller';
import { ProjectApiKeyService } from './projectApiKeys.service';

@Module({
  controllers: [ProjectApiKeyController],
  providers: [ProjectApiKeyService],
})
export class ProjectApiKeyModule {}
