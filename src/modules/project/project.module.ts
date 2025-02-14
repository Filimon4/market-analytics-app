import { Module } from "@nestjs/common";
import { ProjectGlobalController } from "./project-global.controller";
import { ProjectController } from "./project.controller";
import { ProjectRolesService } from "./project-roles.service";

@Module({
  providers: [ProjectRolesService, ProjectRolesService],
  controllers: [ProjectGlobalController, ProjectController]
})
export class Project {}