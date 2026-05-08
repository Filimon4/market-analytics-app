import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { Prisma, RolePermission } from '@prisma/client';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { TreeBuilder } from 'src/common/utils/treeBuilder';
import { TreeNode } from 'src/common/utils/treeBuilder/interfaces';

@Injectable()
export class ProjectRoleService {
  constructor(private readonly prismaService: PrismaService) {}

  createRole(projectId: number, dto: CreateRoleDto) {
    return this.prismaService.$transaction(async (trx) => {
      const role = await trx.role.create({
        data: {
          projectId,
          code: dto.code,
          default: dto.default,
          title: dto.title,
        },
        select: {
          id: true,
          code: true,
        },
      });

      const permissions = await trx.permission.findMany({});

      const rolePermissions = permissions.map(
        (per) =>
          ({
            permissionId: per.id,
            roleId: role.id,
            granted: false,
          }) as RolePermission,
      );

      await trx.rolePermission.createMany({
        data: rolePermissions,
        skipDuplicates: true,
      });

      return role;
    });
  }

  updateRole(projectId: number, dto: UpdateRoleDto) {
    return this.prismaService.$transaction(async (trx) => {
      const roleRaw = await trx.$queryRaw<{ id: number }[]>`
        select r.id from public."Role" r
        where r."projectId" = ${projectId} and r.id = ${dto.id}
        limit 1
        for update
      `;

      const role = roleRaw[0];

      const updateRoleData: Prisma.RoleUpdateInput = {};

      if (dto.name) {
        updateRoleData.title = dto.name;
      }

      if (dto.code) {
        updateRoleData.code = dto.code;
      }

      await trx.role.update({
        where: {
          id: role.id,
          projectId: projectId,
        },
        data: updateRoleData,
      });

      if (dto.tree) {
        const nodes = TreeBuilder.pipePermissionTreeToArray(dto.tree as TreeNode[]);

        const permissionRaw = await trx.$queryRaw<{ id: number; code: string }[]>`
          select rp.id, p.code
          from public."RolePermission" rp 
          inner join public."Permission" p on p.id = rp."permissionId"
          where rp."roleId" = ${dto.id}
          for update
        `;

        const permissionRawMap = permissionRaw.reduce<Record<string, number>>((acc, permission) => {
          acc[permission.code] = permission.id;
          return acc;
        }, {});

        const nodesWithId = nodes.map((node) => ({
          id: permissionRawMap[node.key],
          ...node,
        }));

        for (const node of nodesWithId) {
          await trx.rolePermission.update({
            where: {
              id: node.id,
              AND: {
                roleId: dto.id,
                AND: {
                  persmission: {
                    code: String(node.key),
                  },
                },
              },
            },
            select: {
              id: true,
            },
            data: {
              granted: node.checked,
            },
          });
        }
      }
    });
  }
}
