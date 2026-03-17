import { Module } from "@nestjs/common";
import { ProjectUserController } from "./projectUser.controller";

@Module({
  controllers: [ProjectUserController],
})
export class ProjectUserModule {}