/*
  Warnings:

  - You are about to drop the column `code` on the `MetricChannel` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `UfChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MetricChannel" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "UfChannel" DROP COLUMN "code";
