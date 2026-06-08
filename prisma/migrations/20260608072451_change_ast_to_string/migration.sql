/*
  Warnings:

  - You are about to drop the column `ast` on the `metricChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "metricChannel" DROP COLUMN "ast",
ADD COLUMN     "formala" TEXT NOT NULL DEFAULT '';
