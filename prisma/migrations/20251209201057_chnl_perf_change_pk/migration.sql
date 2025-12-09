/*
  Warnings:

  - The primary key for the `ChannelPerformance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ChannelPerformance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ChannelPerformance" DROP CONSTRAINT "ChannelPerformance_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "ChannelPerformance_pkey" PRIMARY KEY ("id");
