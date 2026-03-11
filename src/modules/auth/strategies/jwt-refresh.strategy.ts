import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies['refreshToken'] || null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow("JWT_SECRET")
    })
  }

  async validate(payload: any) {
    return payload;
  }
}