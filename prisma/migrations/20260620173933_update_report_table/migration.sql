/*
  Warnings:

  - You are about to drop the column `daetTo` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "daetTo",
ADD COLUMN     "dateTo" TIMESTAMP(3);
