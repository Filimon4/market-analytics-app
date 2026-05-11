import { Module } from '@nestjs/common';
import { InvitationService } from './projectInvitation.service';
import { ProjectInvitationController } from './projectInvitation.controller';
import { EmailModule } from 'src/shared/email/email.module';
import { EEmailProvider } from 'src/shared/email/enum/provider.enum';

@Module({
  imports: [EmailModule.forRoot(EEmailProvider.TEST)],
  controllers: [ProjectInvitationController],
  providers: [InvitationService],
})
export class ProjectInvitationModule {}
