import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PrismaService } from "src/common/db/prisma.service";
import { User } from "src/common/decorators/user.decorator";
import { CreateProjectDto } from "./dto/createProject.dto";
import { Prisma } from "@prisma/client";


@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectGlobalController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  create(@User() user, @Body() createProjectDto: CreateProjectDto) {
    return this.prismaService.$transaction(async (mng) => {
      const project = await mng.project.create({
        data: {
          name: createProjectDto.name,
          description: createProjectDto.description,
        },
        select: {
          id: true,
          name: true,
          description: true,
        }
      })

      const roles = await mng.userRole.createManyAndReturn({
        data: [
          {
            code: 'owner',
            projectId: project.id,
            default: true
          },
          {
            code: 'analytic',
            projectId: project.id,
            default: true
          },
          {
            code: 'marketing',
            projectId: project.id,
            default: true
          }
        ],
        skipDuplicates: true,
        select: {
          id: true
        }
      })

      const userPersmissions = await mng.userPermission.findMany({
        select: {
          id: true
        }
      })

      for (const role of roles) {
        await mng.rolePermission.createMany({
          data: userPersmissions.map(per => ({userRoleId: role.id, userPermissionId: per.id, granted: false}) as Prisma.RolePermissionCreateManyInput)
        })
      }
      
      await mng.userToProject.create({
        data: {
          blocked: false,
          projectId: project.id,
          userId: user.id,
          roleId: roles[0].id
        }
      })

      return project
    })
  }

}