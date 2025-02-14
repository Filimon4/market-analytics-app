-- AlterTable
ALTER TABLE "Permission" RENAME CONSTRAINT "UserPermission_pkey" TO "Permission_pkey";

-- AlterTable
ALTER TABLE "Role" RENAME CONSTRAINT "UserRole_pkey" TO "Role_pkey";

-- RenameForeignKey
ALTER TABLE "Permission" RENAME CONSTRAINT "UserPermission_parentId_fkey" TO "Permission_parentId_fkey";

-- RenameForeignKey
ALTER TABLE "Role" RENAME CONSTRAINT "UserRole_projectId_fkey" TO "Role_projectId_fkey";

-- RenameIndex
ALTER INDEX "UserPermission_code_key" RENAME TO "Permission_code_key";

-- RenameIndex
ALTER INDEX "UserPermission_name_key" RENAME TO "Permission_name_key";


