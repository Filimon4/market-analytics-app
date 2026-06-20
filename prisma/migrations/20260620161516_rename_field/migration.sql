/*
  Warnings:

  - You are about to drop the column `defaultConfig` on the `ReportType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReportType" DROP COLUMN "defaultConfig",
ADD COLUMN     "detailConfig" JSONB;
