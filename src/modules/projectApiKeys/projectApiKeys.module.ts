import { Module } from '@nestjs/common';
import { ProjectApiKeyController } from './projectApiKeys.controller';
import { ProjectApiKeyTableController } from './projectApiKeys.table.controller';
import { ProjectApiKeyService } from './projectApiKeys.service';

@Module({
  controllers: [ProjectApiKeyController, ProjectApiKeyTableController],
  providers: [ProjectApiKeyService],
})
export class ProjectApiKeyModule {}
