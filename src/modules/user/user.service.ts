import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
      },
    }).catch(() => {
      throw new BadRequestException('Failed to create user');
    })

    return user
  }

  async findAll() {
    const list = await this.prisma.user.findMany({});

    return list.map((usr) => ({ ...usr, id: usr.id.toString() }));
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException('User not found');

    return user
  }

  async findById(id: bigint): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user
  }

  async update(id: bigint, dto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: {} });
  }

  async remove(id: bigint) {
    return this.prisma.user.delete({ where: { id } });
  }
}
