import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';
import { CreateUfChannelsDto } from './dtoUfChannels/createUfChannels.dto';
import { UpdateUfChannelsDto } from './dtoUfChannels/updateUfChannels.dto';
import { UfChannelsService } from './ufChannels.service';

@Controller({ path: 'channels/:channelId/uf-channels', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class UfChannelsController {
  constructor(private readonly ufChannelService: UfChannelsService) {}

  @Post()
  async create(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Body() dto: CreateUfChannelsDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const createdUfChannel = await this.ufChannelService.create(BigInt(channelId), dto);

    return {
      result: {
        id: createdUfChannel.id.toString(),
      },
    };
  }

  @Patch(':id')
  async update(
    @CurrentTenant() projectId: number,
    @Param('channelId') channelId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUfChannelsDto,
  ) {
    await this.ufChannelService.update(BigInt(channelId), BigInt(id), dto);

    return {
      result: true,
    };
  }

  @Delete(':id')
  async delete(@CurrentTenant() projectId: number, @Param('channelId') channelId: string, @Param('id') id: string) {
    await this.ufChannelService.delete(BigInt(channelId), BigInt(id));

    return {
      result: true,
    };
  }

  @Patch(':id/restore')
  async restore(@CurrentTenant() projectId: number, @Param('channelId') channelId: string, @Param('id') id: string) {
    await this.ufChannelService.restore(BigInt(channelId), BigInt(id));

    return {
      result: true,
    };
  }
}
