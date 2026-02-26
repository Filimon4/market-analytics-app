import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { PermissionsForRole } from "./types";

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPermissions(roleId: number): Promise<PermissionsForRole[]> {
    const results = await this.prismaService.$queryRaw<
      PermissionsForRole[]
    >`
      WITH RECURSIVE permission_tree AS (
        SELECT 
            rp.id,
            rp."userPermissionId"  AS perm_id,
            rp.granted,
            up.id          AS node_id,
            up.code,
            up."parentId" as parentId,
            0              AS level
        FROM "RolePermission" rp
        INNER JOIN public."Permission" up ON rp."userPermissionId" = up.id
        WHERE up."parentId" IS null and rp."userRoleId" = ${roleId}

        UNION ALL

        SELECT 
            rp.id,
            rp."userPermissionId",
            rp.granted,
            up.id,
            up.code,
            up."parentId",
            pt.level + 1
        FROM "RolePermission" rp
        INNER JOIN public."Permission" up ON rp."userPermissionId" = up.id
        INNER JOIN permission_tree pt ON up."parentId" = pt.node_id
        where rp."userRoleId" = ${roleId}
    )
    SELECT 
        node_id as "id",
        code,
        granted,
        level,
        parentId as "parentId"
    FROM permission_tree
    ORDER BY level;
    `;
  
    return results;
  }

  async buildPermissionTree(permissions: PermissionsForRole[]) {
    const roots = permissions.filter(per => !per.parentId && per.level === 0)
    
    const findAllChildrens = (perId: PermissionsForRole['id']) => {
      const childrens = permissions.filter((per) => per.parentId == perId)
      
      if (childrens.length === 0) {
        return []
      }
      
      return childrens.map(child => ({...child, childrens: findAllChildrens(child.id)}))
    }

    for (const root of roots) {
       root['childrens'] = findAllChildrens(root.id)
    }
    
    return roots
  }
}