/*
  Warnings:

  - Added the required column `projectId` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE project_id_seq;
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT nextval('project_id_seq');
ALTER SEQUENCE project_id_seq OWNED BY "Project"."id";

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "projectId" BIGINT NOT NULL;

-- AlterTable
CREATE SEQUENCE usertoproject_id_seq;
ALTER TABLE "UserToProject" ALTER COLUMN "id" SET DEFAULT nextval('usertoproject_id_seq');
ALTER SEQUENCE usertoproject_id_seq OWNED BY "UserToProject"."id";

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
