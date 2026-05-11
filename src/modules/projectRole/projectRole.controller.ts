import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { PrismaService } from 'src/common/db/prisma.service';
import { User as UserDB } from '@prisma/client';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { CreateRoleDto } from './dto/createRole.dto';
import { ProjectRoleService } from './projectRole.service';
import { ICreateEntityResponse } from 'src/common/interfaces/ientity.interface';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Controller('project/role')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectRoleController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectRolesService: ProjectRoleService,
  ) {}

  @Post()
  async create(
    @CurrentTenant() projectId: number,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<IApiResultResponse<ICreateEntityResponse>> {
    const role = await this.projectRolesService.createRole(projectId, createRoleDto);

    return {
      result: {
        id: role.id.toString(),
      },
    };
  }

  @Get()
  async get(@CurrentTenant() projectId: number, @User() user: UserDB) {
    const role = await this.prismaService.role.findFirst({
      where: {
        projectId,
        userToProject: {
          some: {
            userId: user.id,
            projectId,
          },
        },
      },
      include: {
        rolePermission: {
          select: {
            granted: true,
            permissionId: true,
            persmission: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    return {
      result: {
        ...role,
      },
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@CurrentTenant() projectId: number, @Body() updateRoleDto: UpdateRoleDto) {
    await this.projectRolesService.updateRole(projectId, updateRoleDto);

    return { result: true };
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentTenant() projectId: number, @Param('roleId', ParseIntPipe) roleId: number) {
    const role = await this.prismaService.role.findUnique({
      where: {
        project: {
          id: projectId,
        },
        id: roleId,
      },
      select: {
        id: true,
        code: true,
        default: true,
        deleted: true,
      },
    });

    if (role.default) {
      throw new BadRequestException('Cannot delete system role');
    }

    if (role.deleted) {
      throw new BadRequestException('The role already deleted');
    }

    await this.prismaService.role.update({
      where: {
        id: role.id,
      },
      data: {
        deleted: true,
      },
    });

    return { result: true };
  }

  @Patch('restore/:roleId')
  @HttpCode(HttpStatus.OK)
  async restore(@CurrentTenant() projectId: number, @Param('roleId', ParseIntPipe) roleId: number) {
    const role = await this.prismaService.role.findUnique({
      where: {
        project: {
          id: projectId,
        },
        id: roleId,
      },
      select: {
        id: true,
        code: true,
        default: true,
        deleted: true,
      },
    });

    if (role.default) {
      throw new BadRequestException('Cannot restore system role');
    }

    if (!role.deleted) {
      throw new BadRequestException('The role is acitve');
    }

    await this.prismaService.role.update({
      where: {
        id: role.id,
      },
      data: {
        deleted: false,
      },
    });

    return { result: true };
  }
}
