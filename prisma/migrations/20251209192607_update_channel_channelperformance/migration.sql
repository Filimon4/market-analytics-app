/*
  Warnings:

  - You are about to drop the column `medium` on the `ChannelPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `ChannelPerformance` table. All the data in the column will be lost.
  - Added the required column `trafficSource` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "trafficSource" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChannelPerformance" DROP COLUMN "medium",
DROP COLUMN "source";
