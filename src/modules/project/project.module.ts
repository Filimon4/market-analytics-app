import { Module } from "@nestjs/common";
import { ProjectGlobalController } from "./project-global.controller";
import { ProjectController } from "./project.controller";

@Module({
  controllers: [ProjectGlobalController, ProjectController]
})
export class Project {}