/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_name_key" ON "UserPermission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_code_key" ON "UserPermission"("code");
