import { Controller, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('project/:projectId')
@UseGuards(JwtAuthGuard)
export class ProjectBaseController {}