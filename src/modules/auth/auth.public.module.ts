import { Global, Module } from '@nestjs/common';
import { JwtModule } from 'src/common/utils/jwt/jwt.module';

@Global()
@Module({
  imports: [JwtModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthPublicModule {}
