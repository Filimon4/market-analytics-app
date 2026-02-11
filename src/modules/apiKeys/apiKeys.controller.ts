import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { GetApiKeyDto } from './dto/getApiKey.dto';
import { CreateApiKeyDto } from './dto/createApiKey.dto';
import { UpdateApiKeyDto } from './dto/updateApiKey.dto';
import { ApiKeyService } from './apiKeys.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.apiKeyService.getById(BigInt(id));
  }

  @Get()
  getList(@Query() dto: GetApiKeyDto) {
    return this.apiKeyService.getList(dto);
  }

  @Post()
  create(@User() user, @Body() dto: CreateApiKeyDto) {
    return this.apiKeyService.create(user, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateApiKeyDto) {
    return this.apiKeyService.update(BigInt(id), dto);
  }
}
