import { Prisma } from '@prisma/client';
import { ReportTypesSelect } from '../constants/reportType.constant';

export type TReportTypeGetPayload = Prisma.ReportTypeGetPayload<{
  select: typeof ReportTypesSelect;
}>;
