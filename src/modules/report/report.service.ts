import { Injectable } from '@nestjs/common';
import { Prisma, User as UserDB } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { CreateReportDto } from '@src/modules/report/dto/createReport.dto';
import { UpdateReportDto } from '@src/modules/report/dto/updateReport.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public create(projectId: bigint, user: UserDB, dto: CreateReportDto) {
    return this.prismaService.report.create({
      data: {
        name: dto.name,
        slug: dto.slug || randomUUID(),
        dateFrom: dto.dateFrom,
        dateTo: dto.dateTo,
        visibility: dto.visibility.code,
        project: {
          connect: {
            id: projectId,
          },
        },
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  public update(id: bigint, dto: UpdateReportDto) {
    const reportData: Prisma.ReportUpdateInput = {};

    if (dto.name) {
      reportData.name = dto.name;
    }

    if (dto.dateFrom) {
      reportData.dateFrom = dto.dateFrom;
    }

    if (dto.dateTo) {
      reportData.dateTo = dto.dateTo;
    }

    if (dto.slug) {
      reportData.slug = dto.slug;
    }

    if (dto.visibility) {
      reportData.visibility = dto.visibility.code;
    }

    return this.prismaService.report.update({
      data: reportData,
      where: {
        id,
      },
    });
  }

  public getById(projectId: bigint, id: bigint) {
    return this.prismaService.report.findUnique({
      where: {
        id,
        projectId,
      },
    });
  }
}
