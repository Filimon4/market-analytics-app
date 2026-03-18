import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
})
export class AppModule {}
