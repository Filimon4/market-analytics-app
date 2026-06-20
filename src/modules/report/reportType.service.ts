import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/common/db/prisma.service';
import { CreateReportTypeDto } from '@src/modules/report/dtoReportType/createReportType.dto';

@Injectable()
export class ReportTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  public list() {
    return this.prismaService.reportType.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  public create(dto: CreateReportTypeDto) {
    return this.prismaService.reportType.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        configSchema: dto.configSchema,
        detailConfig: dto.detailConfig,
      },
    });
  }

  public getById(id: bigint) {
    return this.prismaService.reportType.findUnique({
      where: {
        id,
      },
    });
  }
}
