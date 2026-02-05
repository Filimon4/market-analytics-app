import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

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

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  async getCurrent(@Req() req: Request) {
    const user = await this.userService.findByEmail(req.user.email)

    return {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      role: user.role.code,
      status: user.status.code
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(BigInt(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(BigInt(id));
  }
}
