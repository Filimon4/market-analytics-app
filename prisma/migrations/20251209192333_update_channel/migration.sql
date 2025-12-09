/*
  Warnings:

  - You are about to drop the column `budgetSpent` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `clicks` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `conversions` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `impressions` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `leads` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `periodEnd` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `periodStart` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `trafficSource` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "budgetSpent",
DROP COLUMN "clicks",
DROP COLUMN "conversions",
DROP COLUMN "impressions",
DROP COLUMN "leads",
DROP COLUMN "periodEnd",
DROP COLUMN "periodStart",
DROP COLUMN "trafficSource",
DROP COLUMN "updatedAt";
