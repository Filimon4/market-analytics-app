import { Module } from "@nestjs/common";
import { ProjectRoleController } from "./projectRole.controller";
import { ProjectRoleService } from "./projectRole.service";

@Module({
  controllers: [ProjectRoleController],
  providers: [ProjectRoleService],
  exports: [ProjectRoleService]
})
export class ProjectRoleModule {}