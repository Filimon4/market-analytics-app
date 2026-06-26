import { Module } from '@nestjs/common';
import { ProjectApiKeyController } from './projectApiKeys.controller';
import { ProjectApiKeyTableController } from './projectApiKeys.table.controller';
import { ProjectApiKeyService } from './projectApiKeys.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyScopeGuard } from './guards/api-key-scope.guard';

@Module({
  controllers: [ProjectApiKeyController, ProjectApiKeyTableController],
  providers: [ProjectApiKeyService, ApiKeyGuard, ApiKeyScopeGuard],
  exports: [ProjectApiKeyService, ApiKeyGuard, ApiKeyScopeGuard],
})
export class ProjectApiKeyModule {}
