import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { SignUpDto } from "./dto/singup.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/singin.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  async singup(@Body() dto: SignUpDto) {
    const user = await this.authService.signup(dto)

    return {
      ...user,
      id: user.id.toString()
    }
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Request() req, @Body() dto: SignInDto) {
    return {...req.user, id: BigInt(req.user.id).toString()}
  }
}