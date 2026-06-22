import { Module } from '@nestjs/common';
import { ReportController } from '@src/modules/report/report.controller';
import { ReportTableController } from '@src/modules/report/report.table.controller';
import { ReportService } from '@src/modules/report/report.service';

@Module({
  controllers: [ReportController, ReportTableController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
