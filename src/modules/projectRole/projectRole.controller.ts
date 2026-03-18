import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { PrismaService } from 'src/common/db/prisma.service';
import { Prisma, User as UserDB } from '@prisma/client';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { CreateRoleDto } from './dto/createRole.dto';
import { ProjectRoleService } from './projectRole.service';
import { ProjectAccessGuard } from '../project/guards/project-access.guard';
import { GetRolesTableListDto } from './dto/getRolesTableList.dto';
import { RolesBlockDetails, RolesBlocks, RolesColumns, RolesSelect } from './constants/role.constant';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { IEntity } from 'src/common/interfaces/ientity.interface';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { TRoleGetPayload } from './types/role.type';
import { TreeBuilder } from 'src/common/utils/treeBuilder';

@Controller('project/role')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectRoleController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectRolesService: ProjectRoleService,
  ) {}

  @Post()
  @UseGuards(ProjectAccessGuard)
  createRole(@CurrentTenant() projectId: number, @Body() createRoleDto: CreateRoleDto) {
    return this.projectRolesService.createRole(projectId, createRoleDto);
  }

  @Get()
  async getRole(@CurrentTenant() projectId: number, @User() user: UserDB) {
    const role = await this.prismaService.role.findFirst({
      where: {
        project: {
          id: projectId,
        },
        userToProject: {
          some: {
            userId: user.id,
            projectId: projectId,
          },
        },
      },
      include: {
        rolePermission: {
          select: {
            granted: true,
            permissionId: true,
            persmission: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    return {
      result: {
        ...role,
        projectId: role.projectId.toString(),
      },
    };
  }

  /**
   * Ручки для интерфейса. Возвращает данные для таблицы
   * @param dto GetFilterDto
   * @returns ITableListResponse
   */
  @Post('table/list')
  // guard permission
  async getTableList(
    @CurrentTenant() projectId: number,
    @Body() dto: GetRolesTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TRoleGetPayload>>> {
    const rolesWhereInput: Prisma.RoleWhereInput = {};

    rolesWhereInput.projectId = projectId;

    if (dto.filter?.code) {
      rolesWhereInput.code = { contains: dto.filter.code, mode: 'insensitive' };
    }

    if (dto.filter?.default !== undefined) {
      rolesWhereInput.default = dto.filter.default;
    }

    if (dto.filter?.title) {
      rolesWhereInput.title = { contains: dto.filter.title, mode: 'insensitive' };
    }

    const total = await this.prismaService.role.count({ where: rolesWhereInput, orderBy: { id: 'asc' } });
    const rolesData = await this.prismaService.role.findMany({
      select: RolesSelect,
      orderBy: { id: 'asc' },
      where: rolesWhereInput,
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: RolesColumns,
        data: rolesData,
        page: dto.page,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  /**
   * Ручки для интерфейса. Возвращает данные для таблицы
   * @returns IEntity
   */
  @Get('table/:roleId')
  async getTable(
    @CurrentTenant() projectId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<IApiResultResponse<IEntity>> {
    const rolesWhereInput: Prisma.RoleWhereUniqueInput = {
      projectId,
      id: roleId,
    };

    const roleData = await this.prismaService.role.findUnique({
      where: rolesWhereInput,
      select: {
        id: true,
        title: true,
        code: true,
        default: true,
        rolePermission: {
          select: {
            id: true,
            persmission: {
              select: {
                id: true,
                code: true,
                parentId: true,
                description: true,
                name: true,
              },
            },
            granted: true,
          },
        },
      },
    });

    const permissionTree = TreeBuilder.buildPermissionTree(roleData.rolePermission);

    // TODO: Принимать изминений из дерева
    return {
      result: {
        blocks: RolesBlocks,
        blockDetails: RolesBlockDetails,
        data: {
          id: roleData.id,
          title: roleData.title,
          code: roleData.code,
          default: roleData.default,
          permissionTree,
        },
      },
    };
  }
}
