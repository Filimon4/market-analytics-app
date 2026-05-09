import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/shared/tenant/guards/tenant.guard';
import { InvitationSendDto } from './dto/invitationSend.dto';
import { CurrentTenant } from 'src/shared/tenant/decorators/current-tenant.decorator';
import { InvitationListDto } from './dto/infitationLIst.dto';
import { InvitationService } from './projectInvitation.service';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserDB } from '@prisma/client';
import { InvitationResendDto } from './dto/invitationResend.dto';

@Controller({ path: 'invitations', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectInvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async send(@CurrentTenant() projectId: number, @Body() dto: InvitationSendDto, @User() user: UserDB) {
    await this.invitationService.send(projectId, dto, user);

    return { result: true };
  }

  @Post('/:token/resend')
  @HttpCode(HttpStatus.CREATED)
  async resend(@CurrentTenant() projectId: number, @Param('token') token: string, @User() user: UserDB) {
    // await this.invitationService.resend(projectId, dto, user);

    return { result: true };
  }

  @Patch('/:token/accept')
  @HttpCode(HttpStatus.OK)
  async accept(@Param('token') token: string, @User() user: UserDB) {
    console.log(token, user);
    await this.invitationService.accept(token, user);

    return { result: true };
  }

  @Patch('/:token/decline')
  @HttpCode(HttpStatus.OK)
  async decline(@Param('token') token: string, @User() user: UserDB) {
    await this.invitationService.decline(token, user);

    return { result: true };
  }

  @Patch('/:token/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@User() user: UserDB, @Param('token') token: string) {
    await this.invitationService.cancel(token, user);

    return { result: true };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@CurrentTenant() projectId: number, @Query() dto: InvitationListDto) {
    const list = await this.invitationService.list(projectId, dto);

    return { result: list };
  }
}
