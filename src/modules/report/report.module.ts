import { Module } from '@nestjs/common';
import { ReportController } from '@src/modules/report/report.controller';
import { ReportTableController } from '@src/modules/report/report.table.controller';
import { ReportService } from '@src/modules/report/report.service';
import { ReportTypeController } from '@src/modules/report/reportType.controller';
import { ReportTypeTableController } from '@src/modules/report/reportType.table.controller';
import { ReportTypeService } from '@src/modules/report/reportType.service';

@Module({
  controllers: [ReportController, ReportTableController, ReportTypeController, ReportTypeTableController],
  providers: [ReportService, ReportTypeService],
  exports: [ReportService, ReportTypeService],
})
export class ReportModule {}
