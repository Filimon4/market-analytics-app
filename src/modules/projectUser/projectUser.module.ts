import { Module } from '@nestjs/common';
import { ProjectUserTableController } from './projectUser.table.controller';
import { ProjectUserService } from './projectUser.service';
import { ProjectUserController } from './projectUser.controller';

@Module({
  controllers: [ProjectUserTableController, ProjectUserController],
  providers: [ProjectUserService],
})
export class ProjectUserModule {}
