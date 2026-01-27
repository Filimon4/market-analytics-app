import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { SignUpDto } from "./dto/singup.dto";
import { SignInDto } from "./dto/singin.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { EncryptionService } from "src/common/utils/encryption/encryption.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly encryptionService: EncryptionService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null
    }
    const isPassword = this.encryptionService.compare(password, user.password)
    return isPassword ? user : null
  }

  async singin(dto: SignInDto) {

  }

  async signup(dto: SignUpDto) {
    const encryptedPassword = this.encryptionService.encrypt(dto.password);
    
    const user = await this.userService.create({
      email: dto.email,
      name: "",
      password: encryptedPassword,
      roleId: 1,
      statusId: 1
    }).catch(() => {
      throw new BadRequestException("Cannot create user")
    })

    return user
  }
}