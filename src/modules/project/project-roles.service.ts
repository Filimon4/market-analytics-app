import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { CreateRoleDto } from "./dto/createRole.dto";
import { RolePermission } from "@prisma/client";

@Injectable()
export class ProjectRolesService {
  constructor(private readonly prismaService: PrismaService) {}

  createRole(projectId: number, dto: CreateRoleDto) {
    return this.prismaService.$transaction(async (mng) => {
      const role = await mng.role.create({
        data: {
          projectId,
          code: dto.code,
          default: false
        },
        select: {
          id: true,
          code: true,
        }
      })

      const permissions = await mng.permission.findMany({})
      
      const rolePermissions = permissions.map((per) => ({
        permissionId: per.id,
        roleId: role.id,
        granted: false,
      }) as RolePermission)

      await mng.rolePermission.createMany({
        data: rolePermissions,
        skipDuplicates: true
      })

      return role
    })
  }

  getPermissionByCode(roleId: number, code: string) {
    
  }
}