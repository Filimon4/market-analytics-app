import { Module } from "@nestjs/common";
import { ProjectGlobalController } from "./project-global.controller";
import { ProjectController } from "./project.controller";
import { ProjectRolesService } from "./project-roles.service";
import { ProjectService } from "./project.service";

@Module({
  providers: [ProjectRolesService, ProjectService],
  controllers: [ProjectGlobalController, ProjectController]
})
export class Project {}