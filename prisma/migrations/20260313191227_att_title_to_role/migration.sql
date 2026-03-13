-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'None';

-- RenameForeignKey
ALTER TABLE "RolePermission" RENAME CONSTRAINT "RolePermission_userPermissionId_fkey" TO "RolePermission_permissionId_fkey";

-- RenameForeignKey
ALTER TABLE "RolePermission" RENAME CONSTRAINT "RolePermission_userRoleId_fkey" TO "RolePermission_roleId_fkey";
