import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { $Enums, User as UserDB } from '@prisma/client';
import { User } from '@src/common/decorators/user.decorator';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { CreateReportDto } from '@src/modules/report/dto/createReport.dto';
import { UpdateReportDto } from '@src/modules/report/dto/updateReport.dto';
import { ReportService } from '@src/modules/report/report.service';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';

@Controller({ path: 'reports', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(
    @CurrentTenant() projectId: bigint,
    @User() user: UserDB,
    @Body() dto: CreateReportDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const report = await this.reportService.create(projectId, user, dto);

    return {
      result: {
        id: report.id.toString(),
      },
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    await this.reportService.update(BigInt(id), dto);

    return { result: true };
  }

  @Get(':id')
  async getById(@CurrentTenant() projectId: bigint, @Param('id') id: string) {
    const report = await this.reportService.getById(projectId, BigInt(id));

    return {
      result: {
        ...report,
        visibility: {
          code: report.visibility,
        },
      },
    };
  }

  @Get('visibility/select')
  async getVisibilitySelect() {
    return {
      result: Object.keys($Enums.ReportVisibility).map((r) => ({
        id: r,
        code: r,
      })),
    };
  }
}
