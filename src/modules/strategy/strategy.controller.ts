import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { CreateStrategyDto } from './dto/createStrategy.dto';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { ICreateEntityResponse } from 'src/common/interfaces/ientity.interface';
import { UpdateStrategyDto } from './dto/updateStrategy.dto';
import { GetStrategyListDto } from './dto/getStrategyList.dto';

@Controller('strategies')
@UseGuards(JwtAuthGuard, TenantGuard)
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Post()
  async create(
    @CurrentTenant() projectId: number,
    @Body() dto: CreateStrategyDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const strategy = await this.strategyService.create(projectId, dto);

    return {
      result: {
        id: strategy.id.toString(),
      },
    };
  }

  @Get('select')
  async list(@CurrentTenant() projectId: number, @Query() dto: GetStrategyListDto) {
    const list = await this.strategyService.list(projectId, dto.includeDeleted);

    return {
      result: list.map((str) => ({
        id: str.id,
        code: str.name,
      })),
    };
  }

  @Get(':id')
  async getById(@CurrentTenant() projectId: number, @Param('id', ParseIntPipe) id: number) {
    const strategy = await this.strategyService.getById(projectId, id);

    return { result: strategy };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@CurrentTenant() projectId: number, @Body() dto: UpdateStrategyDto) {
    await this.strategyService.update(projectId, dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentTenant() projectId: number, @Param('id', ParseIntPipe) id: number) {
    await this.strategyService.delete(projectId, id);

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@CurrentTenant() projectId: number, @Param('id', ParseIntPipe) id: number) {
    await this.strategyService.restore(projectId, id);

    return { result: true };
  }
}
