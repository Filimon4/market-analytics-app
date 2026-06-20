import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { CreateReportTypeDto } from '@src/modules/report/dtoReportType/createReportType.dto';
import { ReportTypeService } from '@src/modules/report/reportType.service';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';

@Controller({ path: 'report-types', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReportTypeController {
  constructor(private readonly reportTypeService: ReportTypeService) {}

  @Post()
  async create(@Body() dto: CreateReportTypeDto): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const reporType = await this.reportTypeService.create(dto);

    return {
      result: {
        id: reporType.id.toString(),
      },
    };
  }

  @Get('select')
  async list() {
    const list = await this.reportTypeService.list();

    return {
      result: list.map((reportType) => ({
        id: reportType.id,
        code: reportType.name,
      })),
    };
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.reportTypeService.getById(BigInt(id));
  }
}
