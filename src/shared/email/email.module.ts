import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendEmailProvider } from './providers/resend.provider';
import { EMAIL_PROVIDER_TOKEN } from './constants';

export enum EmailProviderType {
  RESEND = 'RESEND',
}

@Module({})
export class EmailModule {
  static forRoot(providerType: EmailProviderType = EmailProviderType.RESEND): DynamicModule {
    const provider: Provider = this.getProvider(providerType);

    return {
      module: EmailModule,
      providers: [provider, EmailService],
      exports: [EmailService],
    };
  }

  private static getProvider(type: EmailProviderType): Provider {
    switch (type) {
      case EmailProviderType.RESEND:
        return {
          provide: EMAIL_PROVIDER_TOKEN,
          useClass: ResendEmailProvider,
        };
      default:
        throw new Error(`Unknown email provider: ${type}`);
    }
  }
}
