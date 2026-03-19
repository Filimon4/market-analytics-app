import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma.service';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { Prisma, User as UserDB } from '@prisma/client';
import { GetUsersToProjectTableListDto } from './dto/getUsersToProjectTableList.dto';
import { TUsersToProjectResponse } from './types/user.interface';
import {
  UsersToProjectSelect,
  UserToProjectBlockDetails,
  UserToProjectBlocks,
  UserToProjectColumns,
} from './constants/user.constant';
import { User } from 'src/common/decorators/user.decorator';

@Controller('project/user')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectUserController {
  constructor(private readonly prismaService: PrismaService) {}

  // TODO: Приглашение пользователя
  @Post('/invite')
  async createInvite(@CurrentTenant() projectId: number, @Body() dto) {}

  // TODO: Принять приглашение
  @Get('/invite/:hash')
  async appeptInvite(@Param('hash') hash: string, @User() user: UserDB) {}

  /**
   * Ручки для интерфейса. Возвращает данные для таблицы
   * @param dto GetFilterDto
   * @returns ITableListResponse
   */
  @Post('table/list')
  // guard permission
  async getTableList(
    @CurrentTenant() projectId: number,
    @Body() dto: GetUsersToProjectTableListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TUsersToProjectResponse>>> {
    const whereUserInput: Prisma.UserToProjectWhereInput = {};

    whereUserInput.projectId = projectId;

    if (dto.filter.blocked !== undefined) {
      whereUserInput.blocked = { equals: dto.filter.blocked };
    }

    if (dto.filter.role?.id) {
      whereUserInput.userRole = { id: dto.filter.role.id };
    }

    if (dto.filter.userEmail) {
      whereUserInput.user = { email: { contains: dto.filter.userEmail } };
    }

    if (dto.filter.userName) {
      whereUserInput.user = { name: { contains: dto.filter.userName } };
    }

    const total = await this.prismaService.userToProject.count({ where: whereUserInput, orderBy: { id: 'asc' } });
    const rolesData = await this.prismaService.userToProject.findMany({
      select: UsersToProjectSelect,
      orderBy: { id: 'asc' },
      where: whereUserInput,
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: UserToProjectColumns,
        data: rolesData.map((role) => ({ ...role, id: role.id.toString() })),
        page: dto.page,
        total: total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  /**
   * Ручки для интерфейса. Возвращает данные для таблицы
   * @returns IEntity
   */
  @Get('table/create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: UserToProjectBlocks,
        blockDetails: UserToProjectBlockDetails,
      },
    };
  }

  /**
   * Ручки для интерфейса. Возвращает данные для таблицы
   * @returns IEntity
   */
  @Get('table/:id')
  async getTable(
    @CurrentTenant() projectId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const userToProjectWhereInput: Prisma.UserToProjectWhereInput = {
      projectId,
      id: userId,
    };

    const userToProjectData = await this.prismaService.userToProject.findFirst({
      where: userToProjectWhereInput,
      select: UsersToProjectSelect,
    });

    return {
      result: {
        blocks: UserToProjectBlocks,
        blockDetails: UserToProjectBlockDetails,
        data: { ...userToProjectData, id: userToProjectData.id.toString() },
      },
    };
  }
}
