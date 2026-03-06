import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { User } from "src/common/decorators/user.decorator";
import { PrismaService } from "src/common/db/prisma.service";
import { User as UserDB } from "@prisma/client";
import { TenantGuard } from "src/shared/tenant/guards/tenant.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentTenant } from "src/shared/tenant/decorators/current-tenant.decorator";
import { CreateRoleDto } from "./dto/createRole.dto";
import { ProjectRolesService } from "./project-roles.service";
import { ProjectAccessGuard } from "./guards/project-access.guard";
import { ProjectService } from "./project.service";
import { GetPanelDto } from "./dto/getPanel.dto";

@Controller('project')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectController {
  constructor(private readonly prismaService: PrismaService, private readonly projectRolesService: ProjectRolesService, private readonly projectService: ProjectService) {}

  @Get()
  async get(@CurrentTenant() projectId: number, @User() user: UserDB) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        userToProject: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        userToProject: {
          where: {
            userId: user.id
          },
          select: {
            id: true,
            userId: true,
            blocked: true,
            roleId: true,
            createdAt: true
          }
        }
      }
    })

    if (project.userToProject.length > 1) {
      throw new BadRequestException('User cannot has more then one connection to a project')
    }

    const userToProject = project.userToProject[0]

    return {
      result: {
        ...project,
        id: project.id.toString(),
        userToProject: {
          ...userToProject,
          id: userToProject.id.toString(),
          userId: userToProject.userId.toString(),
        }
      }
    }
  }

  @Get('panel')
  async getPanel(@Query() roleDto: GetPanelDto) {
    const panel = [
      {
        name: "Маркетинг",
        code: 'PANEL_MARKETING',
        icon: '/icons/marketing.png',
        children: [
          { name: 'Стратегии', code : 'PANEL_MARKETING_STRATEGY', url: 'marketing/strategy'},
          { name: 'Каналы трафика', code : 'PANEL_MARKETING_CHANNELS', url: 'marketing/channels'},
          { name: 'Результаты трафика', code : 'PANEL_MARKETING_CHANNELS_PERFORMANCE', url: 'marketing/channels/performance'},
        ],
      },
      {
        name: 'Проект',
        code: 'PANEL_PROJECTS',
        icon: '/icons/project.png',
        children: [
          { name: 'Разработчику', code: 'PANEL_PROJECTS_DEVELOPER', url: 'projects/developer'},
          { name: 'Апи ключи', code: 'PANEL_PROJECTS_API_KEYS', url: 'projects/apikeys'},
          { name: 'Пользователи', code: 'PANEL_PROJECTS_USERS', url: 'projects/users'},
          { name: 'Роли', code: 'PANEL_PROJECTS_ROLES', url: 'projects/roles'},
        ],
      }
    ]

    const role = await this.prismaService.rolePermission.findMany({
      where: {
        userRole: {
          id: roleDto.roleId
        }
      },
      select: {
        granted: true,
        persmission: {
          select: {
            code: true,
          }
        }
      }
    })

    return {
      result: panel.filter((elem) => {
        return role.find((per) => per.persmission.code === elem.code).granted
      }).map((elem) => {
        return {
          ...elem,
          children: elem.children.filter((perChildren) => role.find((per) => per.persmission.code === perChildren.code ).granted)
        }
      })
    }
  }

  @Post('role')
  @UseGuards(ProjectAccessGuard)
  createRole(@CurrentTenant() projectId: number, @Body() createRoleDto: CreateRoleDto) {
    return this.projectRolesService.createRole(projectId, createRoleDto)
  }

  @Get('role')
  async getRole(@CurrentTenant() projectId: number, @User() user: UserDB) {
    const role = await this.prismaService.role.findFirst({
      where: {
        project: {
          id: projectId
        },
        userToProject: {
          some: {
            userId: user.id,
            projectId: projectId
          }
        }
      },
      include: {
        rolePermission: {
          select: {
            granted: true,
            permissionId: true,
            persmission: {
              select: {
                code: true,
              }
            }
          },
        }
      }
    })

    return { result: {
        ...role,
        projectId: role.projectId.toString()
      }
    }
  }

  @Get('roles')
  getAllRoles() {
    return this.prismaService.role.findMany({
      select: {
        code: true,
        default: true
      }
    })
  }
}