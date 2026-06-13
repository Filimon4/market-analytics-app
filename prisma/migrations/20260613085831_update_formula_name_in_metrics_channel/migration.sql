/*
  Warnings:

  - You are about to drop the column `formala` on the `MetricChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MetricChannel" DROP COLUMN "formala",
ADD COLUMN     "formula" TEXT NOT NULL DEFAULT '';
