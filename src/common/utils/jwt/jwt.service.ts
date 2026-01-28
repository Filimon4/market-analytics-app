import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwt: NestJwtService,
    private readonly config: ConfigService,
  ) {}

  signAccessToken(payload: { sub: number | string; email: string }): string {
    return this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES') || '15m',
    });
  }

  signRefreshToken(payload: { sub: number | string; email: string }): string {
    return this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES') || '7d',
    });
  }

  verifyRefreshToken(token: string): any {
    return this.jwt.verify(token, {
      secret: this.config.getOrThrow('JWT_SECRET'),
    });
  }
}