import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { IEntityResponse } from '@src/common/interfaces/ientity.interface';
import { ITableListResponse } from '@src/common/interfaces/itable.interface';
import {
  ReportsBlockDetails,
  ReportsBlocks,
  ReportsColumns,
  ReportsSelect,
} from '@src/modules/report/constants/report.constant';
import { GetReportsTableListDto } from '@src/modules/report/dto/getReportsTableList.dto';
import { TReportGetPayload } from '@src/modules/report/types/report.type';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';

@Controller('reports/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReportTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: bigint,
    @Body() dto: GetReportsTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TReportGetPayload>>> {
    const whereInput: Prisma.ReportWhereInput = {
      projectId,
    };

    if (dto.filter?.name) {
      whereInput.name = { contains: dto.filter.name, mode: 'insensitive' };
    }

    if (dto.filter?.slug) {
      whereInput.slug = { contains: dto.filter.slug, mode: 'insensitive' };
    }

    if (dto.filter?.reportType) {
      whereInput.reportTypeId = BigInt(dto.filter.reportType.id);
    }

    if (dto.filter?.visibility) {
      whereInput.visibility = dto.filter.visibility;
    }

    if (dto.filter?.deleted !== undefined) {
      whereInput.deleted = dto.filter.deleted;
    }

    if (dto.filter?.dateFrom) {
      whereInput.dateFrom = {
        gte: dto.filter.dateFrom.from,
        lte: dto.filter.dateFrom.to,
      };
    }

    if (dto.filter?.dateTo) {
      whereInput.dateTo = {
        gte: dto.filter.dateTo.from,
        lte: dto.filter.dateTo.to,
      };
    }

    if (dto.filter?.createdAt) {
      whereInput.createdAt = {
        gte: dto.filter.createdAt.from,
        lte: dto.filter.createdAt.to,
      };
    }

    const total = await this.prismaService.report.count({ where: whereInput });
    const data = await this.prismaService.report.findMany({
      select: ReportsSelect,
      orderBy: { id: 'asc' },
      where: whereInput,
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: ReportsColumns,
        data,
        page: dto.page,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  @Get('create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: ReportsBlocks,
        blockDetails: ReportsBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: bigint,
    @Param('id') id: string,
  ): Promise<IApiResultResponse<IEntityResponse<{}>>> {
    const data = await this.prismaService.report.findFirst({
      where: {
        id: BigInt(id),
        projectId,
      },
      select: ReportsSelect,
    });

    if (!data) {
      throw new NotFoundException('Report not found');
    }

    return {
      result: {
        blocks: ReportsBlocks,
        blockDetails: ReportsBlockDetails,
        data: {
          ...data,
          visibility: {
            code: data.visibility,
          },
        },
      },
    };
  }
}
