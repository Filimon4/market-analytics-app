import { Body, Controller, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { ChannelPerformancePropertyService } from '@src/modules/channelPerformance/channelPerformanceProperty.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { UpdatePerformancePropertyDto } from '@src/modules/channelPerformance/dtoProperty/updatePerformanceProperty.dto';

@Controller({ path: 'public/channel-performances/:channelId/properties', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
@RequireApiKeyScopes('performances:write')
export class PublicChannelPerformancePropertyController {
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
