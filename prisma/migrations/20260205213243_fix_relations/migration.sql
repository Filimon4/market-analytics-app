/*
  Warnings:

  - You are about to drop the `_UserRoleToUserToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserStatusToUserToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserToProject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Strategy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserRoleToUserToProject" DROP CONSTRAINT "_UserRoleToUserToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRoleToUserToProject" DROP CONSTRAINT "_UserRoleToUserToProject_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserStatusToUserToProject" DROP CONSTRAINT "_UserStatusToUserToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserStatusToUserToProject" DROP CONSTRAINT "_UserStatusToUserToProject_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserToProject" DROP CONSTRAINT "_UserToUserToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserToProject" DROP CONSTRAINT "_UserToUserToProject_B_fkey";

-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "projectId" BIGINT NOT NULL;

-- DropTable
DROP TABLE "_UserRoleToUserToProject";

-- DropTable
DROP TABLE "_UserStatusToUserToProject";

-- DropTable
DROP TABLE "_UserToUserToProject";

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "UserStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
