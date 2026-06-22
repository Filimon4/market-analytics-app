/*
  Warnings:

  - You are about to drop the column `reportTypeId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `ReportType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reportTypeId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reportTypeId",
ADD COLUMN     "config" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "ReportType";
