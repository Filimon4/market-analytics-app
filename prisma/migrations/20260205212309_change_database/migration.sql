/*
  Warnings:

  - You are about to drop the column `permissions` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `ownerUserId` on the `Strategy` table. All the data in the column will be lost.
  - You are about to drop the `UserSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Strategy" DROP CONSTRAINT "Strategy_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_statusId_fkey";

-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_userId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "permissions",
ADD COLUMN     "projectId" BIGINT NOT NULL,
ADD COLUMN     "scope" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Strategy" DROP COLUMN "ownerUserId";

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "userrole_id_seq";

-- DropTable
DROP TABLE "UserSession";

-- CreateTable
CREATE TABLE "Project" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" INTEGER NOT NULL,
    "userRoleId" INTEGER NOT NULL,
    "userPermissionId" INTEGER NOT NULL,
    "granted" BOOLEAN NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToProject" (
    "id" BIGINT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" BIGINT NOT NULL,
    "blocked" BOOLEAN NOT NULL,

    CONSTRAINT "UserToProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserToProject" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_UserToUserToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserRoleToUserToProject" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_UserRoleToUserToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserStatusToUserToProject" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_UserStatusToUserToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserToUserToProject_B_index" ON "_UserToUserToProject"("B");

-- CreateIndex
CREATE INDEX "_UserRoleToUserToProject_B_index" ON "_UserRoleToUserToProject"("B");

-- CreateIndex
CREATE INDEX "_UserStatusToUserToProject_B_index" ON "_UserStatusToUserToProject"("B");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_userPermissionId_fkey" FOREIGN KEY ("userPermissionId") REFERENCES "UserPermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserToProject" ADD CONSTRAINT "_UserToUserToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserToProject" ADD CONSTRAINT "_UserToUserToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "UserToProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRoleToUserToProject" ADD CONSTRAINT "_UserRoleToUserToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRoleToUserToProject" ADD CONSTRAINT "_UserRoleToUserToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "UserToProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStatusToUserToProject" ADD CONSTRAINT "_UserStatusToUserToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "UserStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStatusToUserToProject" ADD CONSTRAINT "_UserStatusToUserToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "UserToProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
