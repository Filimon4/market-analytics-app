import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        role: {
          connect: {
            id: dto.roleId,
          },
        },
        status: {
          connect: {
            id: dto.statusId,
          },
        },
      },
    });

    if (!user) throw new BadRequestException('Failed to create user');

    return user
  }

  async findAll() {
    const list = await this.prisma.user.findMany({});

    return list.map((usr) => ({ ...usr, id: usr.id.toString() }));
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, status: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user
  }

  async findById(id: bigint): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, status: true },
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
