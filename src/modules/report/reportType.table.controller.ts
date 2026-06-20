import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { IEntityResponse } from '@src/common/interfaces/ientity.interface';
import { ITableListResponse } from '@src/common/interfaces/itable.interface';
import {
  ReportTypesBlockDetails,
  ReportTypesBlocks,
  ReportTypesColumns,
  ReportTypesSelect,
} from '@src/modules/report/constants/reportType.constant';
import { GetReportTypesTableListDto } from '@src/modules/report/dtoReportType/getReportTypesTableList.dto';
import { TReportTypeGetPayload } from '@src/modules/report/types/reportType.type';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';

@Controller('report-types/table')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReportTypeTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @Body() dto: GetReportTypesTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TReportTypeGetPayload>>> {
    const whereInput: Prisma.ReportTypeWhereInput = {};

    if (dto.filter?.code) {
      whereInput.code = { contains: dto.filter.code, mode: 'insensitive' };
    }

    if (dto.filter?.name) {
      whereInput.name = { contains: dto.filter.name, mode: 'insensitive' };
    }

    if (dto.filter?.description) {
      whereInput.description = { contains: dto.filter.description, mode: 'insensitive' };
    }

    if (dto.filter?.createdAt) {
      whereInput.createdAt = {
        gte: dto.filter.createdAt.from,
        lte: dto.filter.createdAt.to,
      };
    }

    const total = await this.prismaService.reportType.count({ where: whereInput });
    const data = await this.prismaService.reportType.findMany({
      select: ReportTypesSelect,
      orderBy: { id: 'asc' },
      where: whereInput,
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: ReportTypesColumns,
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
        blocks: ReportTypesBlocks,
        blockDetails: ReportTypesBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(@Param('id') id: string): Promise<IApiResultResponse<IEntityResponse<TReportTypeGetPayload>>> {
    const data = await this.prismaService.reportType.findUnique({
      where: {
        id: BigInt(id),
      },
      select: ReportTypesSelect,
    });

    if (!data) {
      throw new NotFoundException('Report type not found');
    }

    return {
      result: {
        blocks: ReportTypesBlocks,
        blockDetails: ReportTypesBlockDetails,
        data,
      },
    };
  }
}
