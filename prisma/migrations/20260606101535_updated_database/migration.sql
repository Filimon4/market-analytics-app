/*
  Warnings:

  - You are about to drop the column `trafficSource` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ChannelPerformance` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `ChannelPerformance` table. All the data in the column will be lost.
  - Added the required column `trafficSourceId` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "trafficSource",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trafficSourceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ChannelPerformance" DROP COLUMN "name",
DROP COLUMN "revenue",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ufMetrics" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ChannelSource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ChannelSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricChannel" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ast" JSONB NOT NULL DEFAULT '{}',
    "code" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "channelId" BIGINT NOT NULL,

    CONSTRAINT "metricChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricToUfChannel" (
    "id" BIGSERIAL NOT NULL,
    "metricId" BIGINT NOT NULL,
    "ufChannelId" BIGINT NOT NULL,

    CONSTRAINT "metricToUfChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ufChannel" (
    "id" BIGSERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "channelId" BIGINT NOT NULL,

    CONSTRAINT "ufChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_trafficSourceId_fkey" FOREIGN KEY ("trafficSourceId") REFERENCES "ChannelSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metricChannel" ADD CONSTRAINT "metricChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metricToUfChannel" ADD CONSTRAINT "metricToUfChannel_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "metricChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metricToUfChannel" ADD CONSTRAINT "metricToUfChannel_ufChannelId_fkey" FOREIGN KEY ("ufChannelId") REFERENCES "ufChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ufChannel" ADD CONSTRAINT "ufChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
