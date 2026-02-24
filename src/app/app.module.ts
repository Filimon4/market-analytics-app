import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/common/db/db.module';
import { ApiKeyModule } from 'src/modules/apiKeys/apiKeys.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ChannelModule } from 'src/modules/channel/channel.module';
import { ChannelPerformanceModule } from 'src/modules/channelPerformance/channelPerformance.module';
import { Project } from 'src/modules/project/project.module';
import { StrategyModule } from 'src/modules/strategy/strategy.module';
import { UserModule } from 'src/modules/user/user.module';
import { TenantModule } from 'src/shared/tenant/tenant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    TenantModule,
    AuthModule,
    UserModule,
    ApiKeyModule,
    StrategyModule,
    ChannelModule,
    ChannelPerformanceModule,
    Project
  ],
})
export class AppModule {}
