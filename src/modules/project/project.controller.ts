import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "src/common/decorators/user.decorator";
import { PrismaService } from "src/common/db/prisma.service";
import { User as UserDB } from "@prisma/client";


@Controller('project')
export class ProjectController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create() {
    // transatction -> create project -> userTOProject owner -> default roles -> commit transaction
  }

  @Get()
  @UseGuards(JwtAuthGuard)
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getById(@Param('id', ParseIntPipe) id: number, @User() user: UserDB) {
    return this.prismaService.project.findMany({
      where: {
        id: id,
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