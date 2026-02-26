import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "src/common/decorators/user.decorator";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, User as UserDB } from "@prisma/client";
import { TenantGuard } from "src/shared/tenant/guards/tenant.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentTenant } from "src/shared/tenant/decorators/current-tenant.decorator";
import { CreateRoleDto } from "./dto/createRole.dto";
import { ProjectRolesService } from "./project-roles.service";
import { ProjectAccessGuard } from "./guards/project-access.guard";
import { ApiHeader } from "@nestjs/swagger";
import { ProjectService } from "./project.service";

@Controller('project')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectController {
  constructor(private readonly prismaService: PrismaService, private readonly projectRolesService: ProjectRolesService, private readonly projectService: ProjectService) {}

  @Get()
  get(@CurrentTenant() projectId: number, @User() user: UserDB) {
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

  @Get('role/permissions')
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Required tenant identifier',
    required: true,
    schema: { type: 'string', example: '123' },
  })
  async permissions(@CurrentTenant() projectId: number, @User() user: UserDB) {
    const userToProject = await this.prismaService.userToProject.findFirst({
      where: {
        projectId,
        AND: {
          userId: user.id,
        }
      },
      select: {
        id: true,
        roleId: true
      }
    })

    const permissions = await this.projectService.getPermissions(userToProject.roleId)

    return {result: await this.projectService.buildPermissionTree(permissions)}
  }

  @Post('role')
  @UseGuards(ProjectAccessGuard)
  createRole(@CurrentTenant() projectId: number, @Body() createRoleDto: CreateRoleDto) {
    return this.projectRolesService.createRole(projectId, createRoleDto)
  }

  @Get('role')
  getAllRoles() {
    return this.prismaService.role.findMany({
      select: {
        code: true,
        default: true
      }
    })
  }
}