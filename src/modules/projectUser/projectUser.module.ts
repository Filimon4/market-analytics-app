import { Module } from '@nestjs/common';
import { ProjectUserController } from './projectUser.table.controller';

@Module({
  controllers: [ProjectUserController],
})
export class ProjectUserModule {}
