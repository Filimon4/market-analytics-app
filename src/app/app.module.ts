import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/common/db/db.module';
import { ApiKeyModule } from 'src/modules/apiKeys/apiKeys.module';
import { ChannelModule } from 'src/modules/channel/channel.module';
import { StrategyModule } from 'src/modules/strategy/strategy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    ApiKeyModule,
    StrategyModule,
    ChannelModule,
  ],
})
export class AppModule {}
