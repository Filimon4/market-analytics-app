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

import { GetApiKeyDto } from './dto/get-api-key.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKeyService } from './apiKeys.service';

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
  create(@Body() dto: CreateApiKeyDto) {
    const createdBy = BigInt(1);
    return this.apiKeyService.create(dto, createdBy);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateApiKeyDto) {
    return this.apiKeyService.update(BigInt(id), dto);
  }
}
