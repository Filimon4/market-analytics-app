import { Module } from '@nestjs/common';
import { ProjectGlobalController } from './projectGlobal.controller';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRoleModule } from '../projectRole/projectRole.module';
import { ProjectGlobalTableController } from './projectGlobal.table.controller';

@Module({
  imports: [ProjectRoleModule],
  controllers: [ProjectGlobalController, ProjectController, ProjectGlobalTableController],
  providers: [ProjectService],
})
export class ProjectModule {}
