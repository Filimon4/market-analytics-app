import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/common/db/db.module';
import { ApiKeyModule } from 'src/modules/apiKeys/apiKeys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    ApiKeyModule,
  ],
})
export class AppModule {}
