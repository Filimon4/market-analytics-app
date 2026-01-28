import { Body, Controller, Get, Post, Request, Response, UseGuards } from "@nestjs/common";
import { SignUpDto } from "./dto/singup.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/singin.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ConfigService } from "@nestjs/config";
import { Response as ExpressResponse } from "express";

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Post('singup')
  async singup(@Response() res: ExpressResponse, @Body() dto: SignUpDto) {
    const tokens = await this.authService.signup(dto.name, dto.email, dto.password)

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true, 
      secure: this.configService.getOrThrow<string>('NODE_ENV') === 'PRODUCTION',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.send({token: tokens.accessToken})
    res.end()
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Response() res: ExpressResponse, @Request() req, @Body() dto: SignInDto) {
    const tokens = await this.authService.generateTokens({email: dto.email, id: req?.user?.id})

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true, 
      secure: this.configService.getOrThrow<string>('NODE_ENV') === 'PRODUCTION',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.send({token: tokens.accessToken})
    res.end()
  }
}