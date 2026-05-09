import { Module } from '@nestjs/common';
import { InvitationService } from './projectInvitation.service';
import { ProjectInvitationController } from './projectInvitation.controller';
import { EmailModule, EmailProviderType } from 'src/shared/email/email.module';

@Module({
  imports: [EmailModule.forRoot(EmailProviderType.RESEND)],
  controllers: [ProjectInvitationController],
  providers: [InvitationService],
})
export class ProjectInvitationModule {}
