import {
  BadRequestException,
  Body,
  ConflictException,
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
import { TreeBuilder } from '@src/common/utils/treeBuilder';

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
    const panel = await this.prismaService.$queryRaw<
      { granted: boolean; id: number; code: string; icon: string; url: string; parentId: number }[]
    >`
      select rp."granted", p.id, p."name", p.code, p."iconUrl" as icon, p."navigationUrl" as url, p."parentId"
      from "RolePermission" rp 
      inner join "Role" r on r.id = rp."roleId" 
      inner join "Permission" p on rp."permissionId" = p.id 
      where r.id = 16 and rp."granted" = true and p."systemType" = 'panel'
      order by p."parentId" desc, p."panelOrder" asc;
    `;

    this.logger.debug(`panel: ${JSON.stringify(panel)}`);

    const panelTree = [];
    const nodeMap = new Map<number, {}>();

    for (const item of panel) {
      nodeMap.set(item.id, { ...item, children: [] });
    }
    for (const item of panel) {
      const node = nodeMap.get(item.id)!;
      if (!item.granted) continue;
      if (item.parentId === null) {
        panelTree.push(node);
      } else {
        const parent = nodeMap.get(item.parentId);
        if (parent) {
          // @ts-ignore
          parent.children!.push(node);
        }
      }
    }

    if (panelTree.length > 1) {
      throw new ConflictException('Panel cannot have multiple root objects');
    }

    return {
      result: panelTree[0].children!,
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
