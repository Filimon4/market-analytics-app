import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from '@src/modules/report/dto/createReport.dto';

export class UpdateReportDto extends PartialType(CreateReportDto) {}
