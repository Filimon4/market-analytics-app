import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendEmailProvider } from './providers/resend.provider';
import { TestEmailProvider } from './providers/test.provider';
import { EMAIL_PROVIDER_TOKEN } from './constants';
import { EEmailProvider } from './enum/provider.enum';

@Module({})
export class EmailModule {
  static forRoot(providerType: EEmailProvider = EEmailProvider.RESEND): DynamicModule {
    const provider: Provider = this.getProvider(providerType);

    return {
      module: EmailModule,
      providers: [provider, EmailService],
      exports: [EmailService],
    };
  }

  private static getProvider(type: EEmailProvider): Provider {
    switch (type) {
      case EEmailProvider.RESEND:
        return {
          provide: EMAIL_PROVIDER_TOKEN,
          useClass: ResendEmailProvider,
        };
      case EEmailProvider.TEST:
        return {
          provide: EMAIL_PROVIDER_TOKEN,
          useClass: TestEmailProvider,
        };
      default:
        throw new Error(`Unknown email provider: ${type}`);
    }
  }
}
