/*
  Warnings:

  - Added the required column `default` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "default" BOOLEAN NOT NULL;
