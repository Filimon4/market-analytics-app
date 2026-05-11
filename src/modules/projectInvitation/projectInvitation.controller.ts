import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { InvitationSendDto } from './dto/invitationSend.dto';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { InvitationListDto } from './dto/infitationLIst.dto';
import { InvitationService } from './projectInvitation.service';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserDB } from '@prisma/client';
import { EInvitationAction } from './enum/action.enum';
import { ApiParam } from '@nestjs/swagger';

// TOOD: Permissions: PROJECT_SEND_INVITE, PROJECT_CANCEL_INVITE
@Controller({ path: 'invitations', version: '1' })
export class ProjectInvitationController {
  private readonly logger = new Logger(ProjectInvitationController.name);

  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async send(@CurrentTenant() projectId: number, @Body() dto: InvitationSendDto, @User() user: UserDB) {
    const token = await this.invitationService.send(projectId, dto, user);

    return { result: token };
  }

  @Post('/:token/resend')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async resend(@CurrentTenant() projectId: number, @Param('token') token: string, @User() user: UserDB) {
    await this.invitationService.resend(projectId, token, user);

    return { result: true };
  }

  @Patch('/:token/cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async cancel(@CurrentTenant() projectId: number, @User() user: UserDB, @Param('token') token: string) {
    await this.invitationService.cancel(projectId, token, user);

    return { result: true };
  }

  @Patch('/:token/:action')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'action', enum: EInvitationAction, enumName: 'EInvitationAction' })
  async action(
    @User() user: UserDB,
    @Param('token') token: string,
    @Param('action', new ParseEnumPipe(EInvitationAction)) action: EInvitationAction,
  ) {
    switch (action) {
      case EInvitationAction.accept: {
        await this.invitationService.accept(token, user);
        break;
      }
      case EInvitationAction.decline: {
        await this.invitationService.decline(token);
        break;
      }
      default: {
        const exhaustiveCheck: never = action;
        this.logger.error(`There is no case for this action: ${exhaustiveCheck}`);
        throw new BadRequestException('Wrong action passed');
      }
    }

    return { result: true };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async list(@CurrentTenant() projectId: number, @Query() dto: InvitationListDto) {
    const list = await this.invitationService.list(projectId, dto);

    return { result: list };
  }

  @Get('/:token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getInvitation(@User() user: UserDB, @Param('token') token: string) {
    const invitation = await this.invitationService.getByToken(token, user);

    return { result: invitation };
  }
}
