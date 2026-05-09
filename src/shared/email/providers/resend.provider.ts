import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailProvider, InvitationEmailData } from '../interfaces/email-provider.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendEmailProvider.name);

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(configService.getOrThrow('RESEND_API_KEY'));
  }

  async sendInvitation(data: InvitationEmailData): Promise<void> {
    try {
      const { data: result, error } = await this.resend.emails.send({
        from: 'Marketing app <onboarding@resend.dev>',
        to: [data.to],
        subject: `${data.inviterName} пригласил вас в проект "${data.projectName}"`,
        html: this.getInvitationHtml(data),
      });

      if (error) {
        this.logger.error(`Resend error: ${error.message}`, error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Invitation email sent to ${data.to} (ID: ${result?.id})`);
    } catch (err) {
      this.logger.error(`Failed to send invitation to ${data.to}`, err);
      throw err;
    }
  }

  private getInvitationHtml(data: InvitationEmailData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Привет!</h2>
        <p><strong>${data.inviterName}</strong> пригласил вас в проект <strong>${data.projectName}</strong>.</p>
        
        ${data.message ? `<p><em>${data.message}</em></p>` : ''}
        
        <a href="${data.inviteLink}"
           target="_blank"
           style="display: inline-block; background: #000; color: white; padding: 14px 28px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          Принять приглашение
        </a>
        
        <p style="color: #666; font-size: 14px;">
          Ссылка действует 7 дней.
        </p>
      </div>
    `;
  }
}
