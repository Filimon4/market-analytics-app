/*
  Warnings:

  - You are about to drop the column `createdBy` on the `ApiKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "createdBy";

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");
