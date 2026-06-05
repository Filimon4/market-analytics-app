import { Injectable } from '@nestjs/common';
import { Prisma, User as UserDB } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { EDefaultCodeRole } from './constants';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateProject(user: UserDB, projectId: number, dto: UpdateProjectDto) {
    const updateProjectData: Prisma.ProjectUpdateInput = {};

    if (dto.name) {
      updateProjectData.name = dto.name;
    }

    if (dto.description !== undefined) {
      updateProjectData.description = dto.description;
    }

    const updatedProject = await this.prismaService.project.update({
      data: updateProjectData,
      where: {
        id: projectId,
        userToProject: {
          every: {
            userId: user.id,
            userRole: {
              code: EDefaultCodeRole.owner,
            },
          },
        },
      },
    });

    return updatedProject;
  }
}
