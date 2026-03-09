import { Body, Controller, Get, NotFoundException, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PrismaService } from "src/common/db/prisma.service";
import { User } from "src/common/decorators/user.decorator";
import { CreateProjectDto } from "./dto/createProject.dto";
import { Prisma, User as UserDB } from "@prisma/client";
import { EPermissionCode } from "./constants";
import { GetProjectDto } from "./dto/getProject.dto";

@Controller('global/project')
@UseGuards(JwtAuthGuard)
export class ProjectGlobalController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('all')
  async all(@User() user: UserDB) {
    const projects = await this.prismaService.userToProject.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        blocked: true,
        projectId: true,
        roleId: true,
        project: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })

    return {result: projects.map((proj) => ({...proj, id: proj.id.toString(), projectId: proj.projectId.toString(), roleId: proj.roleId.toString(), project: {...proj.project, id: proj.project.id.toString()}}))}
  }

  @Get()
  async get(@User() user: UserDB, @Query() dto: GetProjectDto) {
    const whereProject: Prisma.ProjectWhereInput = {
      userToProject: {
        every: {
          userId: user.id
        }
      },
    }

    const andWhereProject: Prisma.ProjectWhereInput['AND'] = []

    if (dto.userToProjectId) {
      andWhereProject.push({
        userToProject: {
          every: {
            id: dto.userToProjectId
          }
        }
      })
    }

    whereProject.AND = andWhereProject

    const project = await this.prismaService.project.findFirst({
      where: whereProject,
      select: {
        id: true,
        name: true,
        description: true
      }
    })

    if (!project) {
      throw new NotFoundException('There is not project')
    }

    return {result: {...project, id: project.id.toString()}}
  }

  @Post()
  create(@User() user: UserDB, @Body() createProjectDto: CreateProjectDto) {
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

      const defaultRoles = [
        {code: "owner"},
        {code: "analytic"},
        {code: "marketing"},
      ]

      const defaultPermissions = {
        ['analytic']: {
          [EPermissionCode.PANEL]: true,
          [EPermissionCode.PANEL_MARKETING]: true,
          [EPermissionCode.PANEL_MARKETING_CHANNELS]: true,
          [EPermissionCode.PANEL_MARKETING_CHANNELS_PERFORMANCE]: true,
          [EPermissionCode.PANEL_MARKETING_STRATEGY]: true,
        },
        ['marketing']: {
          [EPermissionCode.PANEL]: true,
          [EPermissionCode.PANEL_MARKETING]: true,
          [EPermissionCode.PANEL_MARKETING_CHANNELS]: true,
          [EPermissionCode.PANEL_MARKETING_CHANNELS_PERFORMANCE]: true,
          [EPermissionCode.PANEL_MARKETING_STRATEGY]: true,
        }
      }

      const roles = await mng.role.createManyAndReturn({
        data: defaultRoles.map((rol) => ({
          code: rol.code,
          projectId: project.id,
          default: true
        }) as Prisma.RoleCreateManyInput),
        skipDuplicates: true,
        select: {
          id: true,
          code: true
        }
      })

      const ownerRole = roles.find((r) => r.code === 'owner')

      const userPersmissions = await mng.permission.findMany({
        select: {
          id: true,
          code: true,
          parentId: true
        }
      })

      await mng.rolePermission.createMany({
        data: roles.flatMap((role) => userPersmissions.map(per => ({
          userRoleId: role.id,
          userPermissionId: per.id,
          granted: role.code === 'owner' ? true : defaultPermissions[role.code][per.code] || false
        }) as unknown as Prisma.RolePermissionCreateManyInput))
      })
      
      await mng.userToProject.create({
        data: {
          blocked: false,
          project: {
            connect: {
              id: project.id
            }
          },
          user: {
            connect: {
              id: user.id,
              email: user.email
            }
          },
          userRole: {
            connect: {
              id: ownerRole.id
            }
          }
        }
      })

      return {...project, id: String(project.id)}
    })
  }

}