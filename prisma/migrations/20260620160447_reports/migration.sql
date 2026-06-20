-- CreateEnum
CREATE TYPE "ReportVisibility" AS ENUM ('PRIVATE', 'PROJECT');

-- CreateTable
CREATE TABLE "Report" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "reportTypeId" BIGINT NOT NULL,
    "createdById" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3),
    "daetTo" TIMESTAMP(3),
    "visibility" "ReportVisibility" NOT NULL DEFAULT 'PROJECT',
    "config" JSONB NOT NULL DEFAULT '{}',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportResult" (
    "id" BIGSERIAL NOT NULL,
    "reportId" BIGINT NOT NULL,
    "paramsHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isStale" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReportResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportResultRow" (
    "id" BIGSERIAL NOT NULL,
    "reportResultId" BIGINT NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "ReportResultRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportType" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "configSchema" JSONB NOT NULL,
    "defaultConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_slug_key" ON "Report"("slug");

-- CreateIndex
CREATE INDEX "ReportResult_reportId_paramsHash_idx" ON "ReportResult"("reportId", "paramsHash");

-- CreateIndex
CREATE INDEX "ReportResult_expiresAt_idx" ON "ReportResult"("expiresAt");

-- CreateIndex
CREATE INDEX "ReportResultRow_reportResultId_rowIndex_idx" ON "ReportResultRow"("reportResultId", "rowIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ReportType_code_key" ON "ReportType"("code");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportTypeId_fkey" FOREIGN KEY ("reportTypeId") REFERENCES "ReportType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserToProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportResult" ADD CONSTRAINT "ReportResult_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportResultRow" ADD CONSTRAINT "ReportResultRow_reportResultId_fkey" FOREIGN KEY ("reportResultId") REFERENCES "ReportResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
