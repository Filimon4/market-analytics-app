/*
  Warnings:

  - You are about to drop the column `created_at` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `device_info` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserSession` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_user_id_fkey";

-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "created_at",
DROP COLUMN "device_info",
DROP COLUMN "expires_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deviceInfo" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
