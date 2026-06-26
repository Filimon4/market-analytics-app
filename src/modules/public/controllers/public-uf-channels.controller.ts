import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UfChannelsService } from '@src/modules/channel/ufChannels.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CreateUfChannelsDto } from '@src/modules/channel/dtoUfChannels/createUfChannels.dto';
import { UpdateUfChannelsDto } from '@src/modules/channel/dtoUfChannels/updateUfChannels.dto';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';

@Controller({ path: 'public/channels/:channelId/uf-channels', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
@RequireApiKeyScopes('channels:write')
export class PublicUfChannelsController {
  constructor(private readonly ufChannelsService: UfChannelsService) {}

  @Post()
  async create(
    @Param('channelId') channelId: string,
    @Body() dto: CreateUfChannelsDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const ufChannel = await this.ufChannelsService.create(BigInt(channelId), dto);

    return {
      result: {
        id: ufChannel.id.toString(),
      },
    };
  }

  @Patch(':id')
  async update(@Param('channelId') channelId: string, @Param('id') id: string, @Body() dto: UpdateUfChannelsDto) {
    await this.ufChannelsService.update(BigInt(channelId), BigInt(id), dto);

    return { result: true };
  }

  @Delete(':id')
  async delete(@Param('channelId') channelId: string, @Param('id') id: string) {
    await this.ufChannelsService.delete(BigInt(channelId), BigInt(id));

    return { result: true };
  }

  @Patch(':id/restore')
  async restore(@Param('channelId') channelId: string, @Param('id') id: string) {
    await this.ufChannelsService.restore(BigInt(channelId), BigInt(id));

    return { result: true };
  }
}
