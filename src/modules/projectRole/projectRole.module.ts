import { Module } from '@nestjs/common';
import { ProjectRoleController } from './projectRole.controller';
import { ProjectRoleService } from './projectRole.service';
import { ProjectRoleTableController } from './projectRole.table.controller';
import { EmailModule } from 'src/shared/email/email.module';

@Module({
  controllers: [ProjectRoleController, ProjectRoleTableController],
  providers: [ProjectRoleService],
  exports: [ProjectRoleService],
})
export class ProjectRoleModule {}
