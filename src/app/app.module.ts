import { HttpStatus, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/common/db/db.module';
import { ProjectApiKeyModule } from 'src/modules/projectApiKeys/projectApiKeys.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ChannelModule } from 'src/modules/channel/channel.module';
import { ChannelPerformanceModule } from 'src/modules/channelPerformance/channelPerformance.module';
import { ProjectModule } from 'src/modules/project/project.module';
import { ProjectRoleModule } from 'src/modules/projectRole/projectRole.module';
import { ProjectUserModule } from 'src/modules/projectUser/projectUser.module';
import { StrategyModule } from 'src/modules/strategy/strategy.module';
import { UserModule } from 'src/modules/user/user.module';
import { TenantModule } from 'src/shared/tenant/tenant.module';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ProjectInvitationModule } from 'src/modules/projectInvitation/projectInvitation.module';
import { ClsModule } from 'nestjs-cls';
import { TRACE_HEADER_NAME } from 'src/common/constants';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (request: Request) => String(request.headers[TRACE_HEADER_NAME.toLowerCase()] ?? randomUUID()),
      },
    }),
    DbModule,
    TenantModule,
    AuthModule,

    UserModule,
    StrategyModule,
    ChannelModule,
    ChannelPerformanceModule,

    ProjectModule,
    ProjectApiKeyModule,
    ProjectUserModule,
    ProjectRoleModule,

    ProjectInvitationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter, {
          P2000: HttpStatus.BAD_REQUEST,
          P2002: HttpStatus.CONFLICT,
          P2003: HttpStatus.BAD_REQUEST,
          P2025: HttpStatus.NOT_FOUND,
          P2022: HttpStatus.BAD_REQUEST,
        });
      },
      inject: [HttpAdapterHost],
    },
  ],
})
export class AppModule {}
