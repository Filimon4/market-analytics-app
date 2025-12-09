import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/common/db/db.module';
import { ClientMiddleware } from 'src/common/middleware/client.middleware';
import { ApiKeyModule } from 'src/modules/apiKeys/apiKeys.module';
import { ChannelModule } from 'src/modules/channel/channel.module';
import { StrategyModule } from 'src/modules/strategy/strategy.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DbModule,
    ApiKeyModule,
    StrategyModule,
    ChannelModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientMiddleware).forRoutes('*');
  }
}
