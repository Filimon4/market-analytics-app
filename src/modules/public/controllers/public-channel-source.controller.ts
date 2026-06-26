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
import { ChannelSourceService } from '@src/modules/channelSource/channelSource.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CreateChannelSourceDto } from '@src/modules/channelSource/dto/createChannelSource.dto';
import { UpdateChannelSourceDto } from '@src/modules/channelSource/dto/updateChannelSource.dto';
import { GetChannelSourceListDto } from '@src/modules/channelSource/dto/getChannelSourceList.dto';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { ICreateEntityResponse } from '@src/common/interfaces/ientity.interface';

@Controller({ path: 'public/channel-sources', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
export class PublicChannelSourceController {
  constructor(private readonly channelSourceService: ChannelSourceService) {}

  @Post()
  @RequireApiKeyScopes('sources:write')
  async create(@Body() dto: CreateChannelSourceDto): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const channelSource = await this.channelSourceService.create(dto);

    return {
      result: {
        id: channelSource.id.toString(),
      },
    };
  }

  @Get('select')
  @RequireApiKeyScopes('sources:read')
  async list(@Query() dto: GetChannelSourceListDto) {
    const list = await this.channelSourceService.list(dto.includeDeleted);

    return {
      result: list.map((chnl) => ({
        id: chnl.id,
        code: chnl.name,
      })),
    };
  }

  @Get(':id')
  @RequireApiKeyScopes('sources:read')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const channelSource = await this.channelSourceService.getById(id);

    return { result: channelSource };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('sources:write')
  async update(@Body() dto: UpdateChannelSourceDto) {
    await this.channelSourceService.update(dto);

    return { result: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('sources:write')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.channelSourceService.delete(id);

    return { result: true };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireApiKeyScopes('sources:write')
  async restore(@Param('id', ParseIntPipe) id: number) {
    await this.channelSourceService.restore(id);

    return { result: true };
  }
}
