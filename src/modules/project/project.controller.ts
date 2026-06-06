import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { PrismaService } from 'src/common/db/prisma.service';
import { User as UserDB } from '@prisma/client';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { GetPanelDto } from './dto/getPanel.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ProjectService } from './project.service';

@Controller('project')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectController {
  private readonly logger = new Logger();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectService: ProjectService,
  ) {}

  @Get()
  async get(@CurrentTenant() projectId: number, @User() user: UserDB) {
    const project = await this.prismaService.project.findFirst({
      where: {
        id: projectId,
        userToProject: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        userToProject: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            userId: true,
            blocked: true,
            roleId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!project) {
      throw new BadRequestException('There is no project');
    }

    if (project.userToProject.length > 1) {
      throw new BadRequestException('User cannot has more then one connection to a project');
    }

    const userToProject = project.userToProject[0];

    return {
      result: {
        ...project,
        id: project.id.toString(),
        userToProject: {
          ...userToProject,
          id: userToProject.id.toString(),
          userId: userToProject.userId.toString(),
        },
      },
    };
  }

  @Get('panel')
  async getPanel(@Query() roleDto: GetPanelDto) {
    // TODO: Переделать это
    const panel = [
      {
        name: 'Маркетинг',
        code: 'PANEL_MARKETING',
        icon: '/icons/marketing.png',
        children: [
          { name: 'Стратегии', code: 'PANEL_MARKETING_STRATEGY', url: '/marketing/strategy' },
          { name: 'Каналы трафика', code: 'PANEL_MARKETING_CHANNELS', url: '/marketing/channels' },
          {
            name: 'Результаты трафика',
            code: 'PANEL_MARKETING_CHANNELS_PERFORMANCE',
            url: '/marketing/channels/performance',
          },
        ],
      },
      {
        name: 'Проект',
        code: 'PANEL_PROJECTS',
        icon: '/icons/project.png',
        children: [
          { name: 'Разработчику', code: 'PANEL_PROJECTS_DEVELOPER', url: '/projects/developer' },
          { name: 'Апи ключи', code: 'PANEL_PROJECTS_API_KEYS', url: '/projects/apikeys' },
          { name: 'Пользователи', code: 'PANEL_PROJECTS_USERS', url: '/projects/users' },
          { name: 'Роли', code: 'PANEL_PROJECTS_ROLES', url: '/projects/roles' },
          { name: 'Приглашения', code: 'PANEL_PROJECTS_INVITE', url: '/projects/invitations' }, // TODO: Сделать страницу
          { name: 'Виды канала трафика', code: 'PANEL_PROJECTS_TYPE_CHANNEL_SOURCE', url: '/projects/channelsources' }, // TODO: Сделать страницу
        ],
      },
    ];

    const role = await this.prismaService.rolePermission.findMany({
      where: {
        userRole: {
          id: roleDto.roleId,
        },
      },
      select: {
        granted: true,
        persmission: {
          select: {
            code: true,
          },
        },
      },
    });

    this.logger.debug(`role: ${JSON.stringify(role)}`);

    return {
      result: role.length
        ? panel
            .filter((elem) => {
              const permission = role.find((per) => per.persmission.code === elem.code);
              return permission ? permission.granted : false;
            })
            .map((elem) => {
              return {
                ...elem,
                children: elem.children.filter((perChildren) => {
                  const permission = role.find((per) => per.persmission.code === perChildren.code);

                  return permission ? permission.granted : false;
                }),
              };
            })
        : [],
    };
  }

  @Patch(':projectId')
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @User() user: UserDB,
    @Body() dto: UpdateProjectDto,
  ) {
    const project = await this.projectService.updateProject(user, projectId, dto);

    return { result: project };
  }
}
