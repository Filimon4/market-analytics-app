import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { Prisma } from '@prisma/client';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { GetRolesTableListDto } from './dto/getRolesTableList.dto';
import { RolesBlockDetails, RolesBlocks, RolesColumns, RolesSelect } from './constants/role.constant';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { TRoleGetPayload } from './types/role.type';
import { TreeBuilder } from 'src/common/utils/treeBuilder';

@Controller('project/role/table/')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectRoleTableController {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Ручки для интерфейса. Возвращает данные для таблицы
   * @param dto GetFilterDto
   * @returns ITableListResponse
   */
  @Post('list')
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

    if (dto.filter?.deleted !== undefined) {
      rolesWhereInput.deleted = dto.filter.deleted;
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

  @Get('create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: RolesBlocks,
        blockDetails: RolesBlockDetails,
      },
    };
  }

  /**
   * Ручки для интерфейса. Возвращает данные для таблицы
   * @returns IEntity
   */
  @Get(':roleId')
  async getTable(
    @CurrentTenant() projectId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const rolesWhereInput: Prisma.RoleWhereUniqueInput = {
      projectId,
      id: roleId,
    };

    const roleData = await this.prismaService.role.findUnique({
      where: rolesWhereInput,
      select: {
        ...RolesSelect,
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

    return {
      result: {
        blocks: RolesBlocks,
        blockDetails: RolesBlockDetails,
        data: {
          id: roleData.id,
          title: roleData.title,
          code: roleData.code,
          default: roleData.default,
          tree: permissionTree,
          deleted: roleData.deleted,
        },
      },
    };
  }
}
