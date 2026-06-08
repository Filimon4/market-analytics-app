/*
  Warnings:

  - You are about to drop the column `ufMetrics` on the `ChannelPerformance` table. All the data in the column will be lost.
  - You are about to drop the `metricChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `metricToUfChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ufChannel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "metricChannel" DROP CONSTRAINT "metricChannel_channelId_fkey";

-- DropForeignKey
ALTER TABLE "metricToUfChannel" DROP CONSTRAINT "metricToUfChannel_metricId_fkey";

-- DropForeignKey
ALTER TABLE "metricToUfChannel" DROP CONSTRAINT "metricToUfChannel_ufChannelId_fkey";

-- DropForeignKey
ALTER TABLE "ufChannel" DROP CONSTRAINT "ufChannel_channelId_fkey";

-- AlterTable
ALTER TABLE "ChannelPerformance" DROP COLUMN "ufMetrics";

-- DropTable
DROP TABLE "metricChannel";

-- DropTable
DROP TABLE "metricToUfChannel";

-- DropTable
DROP TABLE "ufChannel";

-- CreateTable
CREATE TABLE "ChannelPerformanceMetricResult" (
    "channelPerformanceId" BIGINT NOT NULL,
    "metricChannelId" BIGINT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ChannelPerformanceMetricResult_pkey" PRIMARY KEY ("channelPerformanceId","metricChannelId")
);

-- CreateTable
CREATE TABLE "MetricChannel" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formala" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "channelId" BIGINT NOT NULL,

    CONSTRAINT "MetricChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricToUfChannel" (
    "id" BIGSERIAL NOT NULL,
    "metricId" BIGINT NOT NULL,
    "ufChannelId" BIGINT NOT NULL,

    CONSTRAINT "MetricToUfChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UfChannel" (
    "id" BIGSERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "channelId" BIGINT NOT NULL,

    CONSTRAINT "UfChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChannelPerformanceMetricResult" ADD CONSTRAINT "ChannelPerformanceMetricResult_channelPerformanceId_fkey" FOREIGN KEY ("channelPerformanceId") REFERENCES "ChannelPerformance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelPerformanceMetricResult" ADD CONSTRAINT "ChannelPerformanceMetricResult_metricChannelId_fkey" FOREIGN KEY ("metricChannelId") REFERENCES "MetricChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricChannel" ADD CONSTRAINT "MetricChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricToUfChannel" ADD CONSTRAINT "MetricToUfChannel_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "MetricChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricToUfChannel" ADD CONSTRAINT "MetricToUfChannel_ufChannelId_fkey" FOREIGN KEY ("ufChannelId") REFERENCES "UfChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UfChannel" ADD CONSTRAINT "UfChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
