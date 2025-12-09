import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        role: {
          connect: {
            id: Number(dto.roleId),
          },
        },
        status: {
          connect: {
            id: Number(dto.statusId),
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { role: true, status: true, strategies: true, apiKeys: true },
    });
  }

  async findOne(id: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, status: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: bigint, dto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: {} });
  }

  async remove(id: bigint) {
    return this.prisma.user.delete({ where: { id } });
  }
}
