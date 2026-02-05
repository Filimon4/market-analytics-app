-- AlterTable
ALTER TABLE "UserToProject" ALTER COLUMN "projectId" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
