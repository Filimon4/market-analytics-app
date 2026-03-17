import { Module } from "@nestjs/common";
import { ProjectGlobalController } from "./projectGlobal.controller";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectRoleModule } from "../projectRole/projectRole.module";

@Module({
  imports: [ProjectRoleModule],
  providers: [ProjectService],
  controllers: [ProjectGlobalController, ProjectController]
})
export class ProjectModule {}