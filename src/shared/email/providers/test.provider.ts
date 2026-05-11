import { Injectable, Logger } from '@nestjs/common';
import { EmailProvider, InvitationEmailData } from '../interfaces/email-provider.interface';

@Injectable()
export class TestEmailProvider implements EmailProvider {
  private readonly logger = new Logger(TestEmailProvider.name);
  private readonly sentInvitations: InvitationEmailData[] = [];

  async sendInvitation(data: InvitationEmailData): Promise<void> {
    this.sentInvitations.push(data);
    this.logger.debug(`Test email captured for ${data.to}`);
  }

  getSentInvitations(): InvitationEmailData[] {
    return [...this.sentInvitations];
  }

  clear(): void {
    this.sentInvitations.length = 0;
  }
}
