import { Module } from "@nestjs/common";
import { ProjectGlobalController } from "./projectGlobal.controller";
import { ProjectController } from "./project.controller";
import { ProjectRoleService } from "./role/projectRole.service";
import { ProjectService } from "./project.service";
import { ProjectRoleController } from "./role/projectRole.controller";
import { ProjectUserController } from "./projectUser.controller";

@Module({
  providers: [ProjectRoleService, ProjectService],
  controllers: [ProjectGlobalController, ProjectController, ProjectRoleController, ProjectUserController]
})
export class Project {}