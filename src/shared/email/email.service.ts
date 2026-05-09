import { Inject, Injectable } from '@nestjs/common';
import { EmailProvider, InvitationEmailData } from './interfaces/email-provider.interface';
import { EMAIL_PROVIDER_TOKEN } from './constants';

@Injectable()
export class EmailService {
  constructor(
    @Inject(EMAIL_PROVIDER_TOKEN)
    private readonly emailProvider: EmailProvider,
  ) {}

  async sendInvitation(data: InvitationEmailData): Promise<void> {
    return this.emailProvider.sendInvitation(data);
  }
}
