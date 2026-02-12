-- AlterTable
ALTER TABLE "UserPermission" ADD COLUMN     "description" TEXT,
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "UserPermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
