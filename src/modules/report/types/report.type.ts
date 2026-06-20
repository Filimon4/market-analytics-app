import { Prisma } from '@prisma/client';
import { ReportsSelect } from '../constants/report.constant';

export type TReportGetPayload = Prisma.ReportGetPayload<{
  select: typeof ReportsSelect;
}>;
