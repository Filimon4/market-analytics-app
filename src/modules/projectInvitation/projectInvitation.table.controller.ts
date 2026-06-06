import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/db/prisma.service';
import { IApiResultResponse } from 'src/common/interfaces/api.interface';
import { IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableListResponse } from 'src/common/interfaces/itable.interface';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InvitationListDto } from './dto/infitationLIst.dto';
import {
  InvitationBlockDetails,
  InvitationBlocks,
  InvitationColumns,
  InvitationSelect,
} from './constants/table.constant';
import { TInvitationResponse } from './types/invitation.table';

@Controller({ path: 'invitations/table', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectInvitationTableController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('list')
  async getTableList(
    @CurrentTenant() projectId: number,
    @Body() dto: InvitationListDto,
  ): Promise<IApiResultResponse<ITableListResponse<TInvitationResponse>>> {
    const whereInvitationInput: Prisma.InvitationWhereInput = {
      projectId,
    };

    if (dto.filter?.status) {
      whereInvitationInput.status = dto.filter.status as $Enums.InvitationStatus;
    }

    if (dto.filter?.email) {
      whereInvitationInput.email = {
        contains: dto.filter.email,
        mode: 'insensitive',
      };
    }

    if (dto.filter.expiresAt) {
      whereInvitationInput.expiresAt = {
        gte: dto.filter.expiresAt.from,
        lte: dto.filter.expiresAt.to,
      };
    }

    if (dto.filter.invitedBy) {
      whereInvitationInput.invite = {
        user: {
          email: {
            contains: dto.filter.invitedBy,
          },
        },
      };
    }

    const total = await this.prismaService.invitation.count({ where: whereInvitationInput });
    const invitationsData = await this.prismaService.invitation.findMany({
      where: whereInvitationInput,
      select: InvitationSelect,
      orderBy: { createdAt: 'desc' },
      take: dto.size,
      skip: (dto.page - 1) * dto.size,
    });

    return {
      result: {
        columns: InvitationColumns,
        data: invitationsData.map((item) => ({ ...item, id: item.id.toString() })),
        page: dto.page,
        total,
        maxPage: Math.max(Math.ceil(total / dto.size), 1),
      },
    };
  }

  @Get('create')
  async getTableCreate(): Promise<IApiResultResponse<Pick<IEntityResponse, 'blocks' | 'blockDetails'>>> {
    return {
      result: {
        blocks: InvitationBlocks,
        blockDetails: InvitationBlockDetails,
      },
    };
  }

  @Get(':id')
  async getTableEntity(
    @CurrentTenant() projectId: number,
    @Param('id', ParseIntPipe) invitationId: number,
  ): Promise<IApiResultResponse<IEntityResponse<TInvitationResponse>>> {
    const invitationData = await this.prismaService.invitation.findFirst({
      where: {
        projectId,
        id: invitationId,
      },
      select: InvitationSelect,
    });

    if (!invitationData) {
      throw new NotFoundException('Invitation not found');
    }

    return {
      result: {
        blocks: InvitationBlocks,
        blockDetails: InvitationBlockDetails,
        data: {
          ...invitationData,
          id: invitationData.id.toString(),
        },
      },
    };
  }
}
