import { Global, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { EncryptionModule } from "src/common/utils/encryption/encryption.module";
import { JwtModule } from "src/common/utils/jwt/jwt.module";

@Global()
@Module({
  imports: [
    EncryptionModule,
    PassportModule,
    UserModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}