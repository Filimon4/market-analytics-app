/*
  Warnings:

  - You are about to drop the column `value` on the `UfChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UfChannel" DROP COLUMN "value";

-- CreateTable
CREATE TABLE "ChannelPerformanceUfChannelResult" (
    "channelPerformanceId" BIGINT NOT NULL,
    "ufChannelId" BIGINT NOT NULL,
    "value" JSONB,

    CONSTRAINT "ChannelPerformanceUfChannelResult_pkey" PRIMARY KEY ("channelPerformanceId","ufChannelId")
);

-- AddForeignKey
ALTER TABLE "ChannelPerformanceUfChannelResult" ADD CONSTRAINT "ChannelPerformanceUfChannelResult_channelPerformanceId_fkey" FOREIGN KEY ("channelPerformanceId") REFERENCES "ChannelPerformance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelPerformanceUfChannelResult" ADD CONSTRAINT "ChannelPerformanceUfChannelResult_ufChannelId_fkey" FOREIGN KEY ("ufChannelId") REFERENCES "UfChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
