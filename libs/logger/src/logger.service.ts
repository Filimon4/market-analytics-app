import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(private readonly clsService: ClsService) {
    super();
  }

  private format(message: string): string {
    const traceId = this.clsService.getId();

    return traceId ? `[${traceId}] ${message}` : message;
  }

  log(message: string, context: string = '') {
    super.log(this.format(message), context);
  }

  error(message: string, trace: string = '', context: string = '') {
    super.error(this.format(message), trace, context);
  }

  warn(message: string, context: string = '') {
    super.warn(this.format(message), context);
  }

  debug(message: string, context: string = '') {
    super.debug(this.format(message), context);
  }

  verbose(message: string, context: string = '') {
    super.verbose(this.format(message), context);
  }
}
