import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from '@src/modules/channel/channel.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { CreateChannelDto } from '@src/modules/channel/dto/createChannel.dto';
import { GetChannelListDto } from '@src/modules/channel/dto/getChannelList.dto';
import { UpdateChannelDto } from '@src/modules/channel/dto/updateChannel.dto';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';

@Controller({ path: 'public/channels', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
export class PublicChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @RequireApiKeyScopes('channels:write')
  async create(
    @CurrentTenant() projectId: number,
    @Body() dto: CreateChannelDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const channel = await this.channelService.create(projectId, dto);

    return {
      result: {
        id: channel.id.toString(),
      },
    };
  }

  @Get('select')
  @RequireApiKeyScopes('channels:read')
  async list(@CurrentTenant() projectId: number, @Query() dto: GetChannelListDto) {
    const list = await this.channelService.list(projectId, dto);

    return { result: list.map((chnl) => ({ id: chnl.id, code: chnl.name })) };
  }

  @Get(':id')
  @RequireApiKeyScopes('channels:read')
  async getById(@CurrentTenant() projectId: number, @Param('id') id: string) {
    const channel = await this.channelService.getById(projectId, BigInt(id));

    return { result: channel };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('channels:write')
  async update(@CurrentTenant() projectId: number, @Param('id') id: string, @Body() dto: UpdateChannelDto) {
    await this.channelService.update(projectId, BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('channels:write')
  async delete(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.channelService.delete(projectId, BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('channels:write')
  async restore(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.channelService.restore(projectId, BigInt(id));

    return { result: true };
  }

  @Put(':id/update-metrics')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('channels:write')
  async updateMetrics(@CurrentTenant() projectId: number, @Param('id') id: string) {
    await this.channelService.updateMetrics(projectId, BigInt(id));

    return { result: true };
  }
}
