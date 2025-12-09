/*
  Warnings:

  - You are about to drop the column `budget_spent` on the `channel` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `channel` table. All the data in the column will be lost.
  - You are about to drop the column `period_end` on the `channel` table. All the data in the column will be lost.
  - You are about to drop the column `period_start` on the `channel` table. All the data in the column will be lost.
  - You are about to drop the column `strategy_id` on the `channel` table. All the data in the column will be lost.
  - You are about to drop the column `traffic_source` on the `channel` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `channel` table. All the data in the column will be lost.
  - Added the required column `budgetSpent` to the `channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodEnd` to the `channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodStart` to the `channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategyId` to the `channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trafficSource` to the `channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `channel_performance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "channel" DROP CONSTRAINT "channel_strategy_id_fkey";

-- AlterTable
ALTER TABLE "channel" DROP COLUMN "budget_spent",
DROP COLUMN "created_at",
DROP COLUMN "period_end",
DROP COLUMN "period_start",
DROP COLUMN "strategy_id",
DROP COLUMN "traffic_source",
DROP COLUMN "updated_at",
ADD COLUMN     "budgetSpent" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "periodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "periodStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "strategyId" BIGINT NOT NULL,
ADD COLUMN     "trafficSource" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "channel_performance" ADD COLUMN     "channelId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_performance" ADD CONSTRAINT "channel_performance_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
