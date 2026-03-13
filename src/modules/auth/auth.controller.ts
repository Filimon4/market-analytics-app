import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { SignUpDto } from "./dto/singup.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/singin.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { User } from "src/common/decorators/user.decorator";

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async singup(@Res({passthrough: true}) res: Response, @Body() dto: SignUpDto) {
    const tokens = await this.authService.signup(dto.name, dto.email, dto.password)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      token: tokens.accessToken
    }
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Res({passthrough: true}) res: Response, @Request() req, @Body() dto: SignInDto) {
    const tokens = await this.authService.generateTokens({email: dto.email, id: req?.user?.id })

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      token: tokens.accessToken
    }
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @User() user,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.generateTokens({email: user.email, id: user.sub })

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      token: tokens.accessToken
    }
  }
}