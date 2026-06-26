/*
  Warnings:

  - You are about to drop the column `conversions` on the `ChannelPerformance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "createdById" BIGINT;

-- AlterTable
ALTER TABLE "ChannelPerformance" DROP COLUMN "conversions";

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserToProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
