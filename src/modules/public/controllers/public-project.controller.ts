import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common';
import { User as UserDB } from '@prisma/client';
import { User } from '@src/common/decorators/user.decorator';
import { PrismaService } from '@src/common/db/prisma.service';
import { ApiKeyGuard } from '@src/modules/projectApiKeys/guards/api-key.guard';
import { ApiKeyScopeGuard } from '@src/modules/projectApiKeys/guards/api-key-scope.guard';
import { RequireApiKeyScopes } from '@src/modules/projectApiKeys/decorators/require-api-key-scopes.decorator';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';

@Controller({ path: 'public/project', version: '1' })
@UseGuards(ApiKeyGuard, ApiKeyScopeGuard)
@RequireApiKeyScopes('project:read')
export class PublicProjectController {
  constructor(private readonly prismaService: PrismaService) {}

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
        },
      },
    });

    if (!project) {
      throw new BadRequestException('There is no project');
    }

    const userToProject = project.userToProject[0];

    return {
      result: {
        ...project,
        id: project.id.toString(),
        userToProject: userToProject
          ? {
              ...userToProject,
              id: userToProject.id.toString(),
              userId: userToProject.userId.toString(),
            }
          : null,
      },
    };
  }
}
