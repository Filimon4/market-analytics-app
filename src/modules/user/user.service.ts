import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prismaService.user
      .create({
        data: {
          email: dto.email,
          name: dto.name,
          password: dto.password,
        },
      })
      .catch(() => {
        throw new BadRequestException('Failed to create user');
      });

    return user;
  }

  async findAll() {
    const list = await this.prismaService.user.findMany({});

    return list.map((usr) => ({ ...usr, id: usr.id.toString() }));
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findById(id: bigint): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: bigint, dto: UpdateUserDto) {
    return this.prismaService.user.update({ where: { id }, data: {} });
  }

  async remove(id: bigint) {
    return this.prismaService.user.delete({ where: { id } });
  }

  async getTableUser(user: User, projectId?: number) {
    const userInfo = {
      user: {},
      userToProject: {},
    };

    const userData = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    userInfo.user = {
      ...userData,
      id: userData.id.toString(),
    };

    if (projectId) {
      const userToProjectData = await this.prismaService.userToProject.findFirst({
        select: {
          blocked: true,
          createdAt: true,
          userRole: {
            select: {
              id: true,
              code: true,
              title: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        where: {
          projectId,
        },
      });

      userInfo.userToProject = {
        ...userToProjectData,
        project: {
          ...userToProjectData.project,
          id: userToProjectData.project.id.toString(),
        },
      };
    }

    return userInfo;
  }
}
