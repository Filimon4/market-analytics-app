import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { User } from "src/common/decorators/user.decorator";
import { PrismaService } from "src/common/db/prisma.service";
import { User as UserDB } from "@prisma/client";
import { ProjectBaseController } from "./project-base.controller";

@Controller()
export class ProjectController extends ProjectBaseController {
  constructor(private readonly prismaService: PrismaService) {
    super()
  }

  @Get()
  all(@User() user: UserDB) {
    return this.prismaService.project.findMany({
      where: {
        userToProject: {
          every: {
            user: {
              id: user.id
            }
          }
        }
      },
      select: {
        name: true,
        description: true,
        id: true
      },
    })
  }

  @Get()
  get(@Param('projectId', ParseIntPipe) projectId: number, @User() user: UserDB) {
    return this.prismaService.project.findMany({
      where: {
        id: projectId,
        userToProject: {
          every: {
            user: {
              id: user.id
            }
          }
        }
      },
      select: {
        name: true,
        description: true,
        id: true
      },
    })
  }
}