/*
  Warnings:

  - You are about to drop the column `statusId` on the `UserToProject` table. All the data in the column will be lost.
  - You are about to drop the `UserStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserToProject" DROP CONSTRAINT "UserToProject_statusId_fkey";

-- AlterTable
ALTER TABLE "UserToProject" DROP COLUMN "statusId";

-- DropTable
DROP TABLE "UserStatus";
