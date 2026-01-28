import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { SignUpDto } from "./dto/singup.dto";
import { SignInDto } from "./dto/singin.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { EncryptionService } from "src/common/utils/encryption/encryption.service";
import { JwtService } from "src/common/utils/jwt/jwt.service";
import { GenerateTokensDto } from "./dto/generateTokens.dto";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly encryptionService: EncryptionService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null
    }
    const isPassword = this.encryptionService.compare(password, user.password)
    return isPassword ? user : null
  }

  async generateTokens(dto: GenerateTokensDto) {
    return {
      accessToken: this.jwtService.signAccessToken({email: dto.email, sub: dto.id}),
      refreshToken: this.jwtService.signRefreshToken({email: dto.email, sub: dto.id})
    }
  }

  async refreshAccess(refreshToken: string) {
    const user = this.jwtService.verifyRefreshToken(refreshToken)

    return this.jwtService.signAccessToken(user)
  }

  async signup(name: string, email: string, password: string) {
    const encryptedPassword = this.encryptionService.encrypt(password);
    
    const user = await this.userService.create({
      email,
      name,
      password: encryptedPassword,
      roleId: 1,
      statusId: 1
    }).catch(() => {
      throw new BadRequestException("Cannot create user")
    })

    return await this.generateTokens({email: user.email, id: user.id.toString()})
  }
}