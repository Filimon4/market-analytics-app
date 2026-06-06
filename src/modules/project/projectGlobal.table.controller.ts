import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IApiResultResponse } from '@src/common/interfaces/api.interface';
import { IEntityResponse } from '@src/common/interfaces/ientity.interface';
import { ProjectBlockDetails, ProjectBlocks } from './constants/project.constant';
import { Prisma, User as UserDB } from '@prisma/client';
import { PrismaService } from '@src/common/db/prisma.service';
import { User } from '@src/common/decorators/user.decorator';
import { EDefaultCodeRole } from './constants';

@Controller('global/project/table')
@UseGuards(JwtAuthGuard)
export class ProjectGlobalTableController {
  constructor(protected readonly prismaService: PrismaService) {}

  @Get('create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: ProjectBlocks,
        blockDetails: ProjectBlockDetails,
      },
    };
  }

  @Get(':projectId')
  async getTable(
    @User() user: UserDB,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<IApiResultResponse<IEntityResponse>> {
    const rolesWhereInput: Prisma.ProjectWhereUniqueInput = {
      id: projectId,
      userToProject: {
        every: {
          // TODO: Это можно вынести в гуард по роли
          userRole: {
            code: EDefaultCodeRole.owner,
          },
          user: {
            id: user.id,
          },
        },
      },
    };

    const projectData = await this.prismaService.project.findUnique({
      where: rolesWhereInput,
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return {
      result: {
        blocks: ProjectBlocks,
        blockDetails: ProjectBlockDetails,
        data: {
          id: String(projectData.id),
          name: projectData.name,
          description: projectData.description,
        },
      },
    };
  }
}
