/*
  Warnings:

  - The primary key for the `MetricToUfChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MetricToUfChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MetricToUfChannel" DROP CONSTRAINT "MetricToUfChannel_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "MetricToUfChannel_pkey" PRIMARY KEY ("metricId", "ufChannelId");
