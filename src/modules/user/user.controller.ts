import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserDB } from '@prisma/client';
import { IEntity } from 'src/common/interfaces/ientity.interface';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { UserBlockDetails, UserBlocks } from './constants';
import { TenantGuard, TenantOptional } from 'src/shared/tenant/guards/tenant.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const createdUser = await this.userService.create(dto);

    return {
      ...createdUser,
      id: createdUser.id.toString()
    };
  }

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  async getCurrent(@Req() req: Request) {
    const user = await this.userService.findByEmail(req.user.email)

    return {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(BigInt(id));

    return {
      ...user,
      id: user.id.toString()
    }
  }

  @Post('table/current')
  @TenantOptional()
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getTableUser(@User() user: UserDB, @CurrentTenant({required: false}) projectId?: number): Promise<IApiResultResponse<IEntity>> {
    
    const data = await this.userService.getTableUser(user, projectId)
    
    return {
      result: {
        blocks: UserBlocks,
        blockDetails: UserBlockDetails,
        data: {
          ...data,
        }
      }
    }
  }
}
