import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "src/common/decorators/user.decorator";
import { PrismaService } from "src/common/db/prisma.service";
import { User as UserDB } from "@prisma/client";
import { TenantGuard } from "src/shared/tenant/guards/tenant.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentTenant } from "src/shared/tenant/decorators/current-tenant.decorator";
import { CreateRoleDto } from "./dto/createRole.dto";
import { ProjectRolesService } from "./project-roles.service";
import { ProjectAccessGuard } from "./guards/project-access.guard";

@Controller('project')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectController {
  constructor(private readonly prismaService: PrismaService, private readonly projectRolesService: ProjectRolesService) {}

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

  @Get('panel')
  async getPanel(@CurrentTenant() projectId: number, @User() user: UserDB) {
    const panelChildren = await this.prismaService.$queryRaw`
      WITH RECURSIVE permission_tree AS (
        SELECT 
          id,
          name,
          code,
          description,
          "parentId"
        FROM public."Permission"
        WHERE code = 'PANEL'

        UNION ALL

        SELECT 
          p.id,
          p.name,
          p.code,
          p.description,
          p."parentId"
        FROM public."Permission" p
        INNER JOIN permission_tree pt ON p."parentId" = pt.id
      )
      SELECT 
        id,
        name,
        code,
        description,
        "parentId"
      FROM permission_tree
      ORDER BY id;
    `.then(rows => rows as Array<{
      id: number;
      name: string;
      code: string;
      description: string | null;
      parentId: number | null;
    }>);

    console.log(panelChildren)

    return panelChildren
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