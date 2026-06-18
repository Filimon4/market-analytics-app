import { Body, Controller, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { ChannelPerformancePropertyService } from './channelPerformanceProperty.service';
import { UpdatePerformancePropertyDto } from './dtoProperty/updatePerformanceProperty.dto';

@Controller('channel-performances/:channelId/properites')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChannelPerformancePropertyController {
  constructor(private readonly service: ChannelPerformancePropertyService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('channelId') channelId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePerformancePropertyDto,
  ) {
    await this.service.update(BigInt(channelId), BigInt(id), dto);

    return { result: true };
  }
}
