import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { $Enums, User as UserDB } from '@prisma/client';
import { User } from '@src/common/decorators/user.decorator';
import { ReportService } from '@src/modules/report/report.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { CreateReportDto } from '@src/modules/report/dto/createReport.dto';
import { UpdateReportDto } from '@src/modules/report/dto/updateReport.dto';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';

@Controller({ path: 'public/reports', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
export class PublicReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @RequireApiKeyScopes('reports:write')
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
  @RequireApiKeyScopes('reports:write')
  async update(@Param('id') id: string, @Body() dto: UpdateReportDto) {
    await this.reportService.update(BigInt(id), dto);

    return { result: true };
  }

  @Get(':id')
  @RequireApiKeyScopes('reports:read')
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
  @RequireApiKeyScopes('reports:read')
  async getVisibilitySelect() {
    return {
      result: Object.keys($Enums.ReportVisibility).map((r) => ({
        id: r,
        code: r,
      })),
    };
  }
}
