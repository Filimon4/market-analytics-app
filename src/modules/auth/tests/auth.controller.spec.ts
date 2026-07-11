import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import type { Response } from 'express';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import type { SignInDto } from '../dto/singin.dto';
import type { SignUpDto } from '../dto/singup.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let res: jest.Mocked<Response>;

  const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

  const expectRefreshCookieToBeSet = () => {
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            generateTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);

    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as jest.Mocked<Response>;
  });

  describe('singup', () => {
    it('creates the user, sets the refresh cookie and returns the access token', async () => {
      authService.signup.mockResolvedValue(tokens);
      const dto: SignUpDto = { name: 'Test User', email: 'test@example.com', password: 'plain-password' };

      const result = await authController.singup(res, dto);

      expect(authService.signup).toHaveBeenCalledWith(dto.name, dto.email, dto.password);
      expectRefreshCookieToBeSet();
      expect(result).toEqual({ token: tokens.accessToken });
    });
  });

  describe('signin', () => {
    it('generates tokens for the authenticated user, sets the refresh cookie and returns the access token', async () => {
      authService.generateTokens.mockResolvedValue(tokens);
      const dto: SignInDto = { email: 'test@example.com', password: 'plain-password' };
      const req = { user: { id: '1' } };

      const result = await authController.signin(res, req, dto);

      expect(authService.generateTokens).toHaveBeenCalledWith({ email: dto.email, id: req.user.id });
      expectRefreshCookieToBeSet();
      expect(result).toEqual({ token: tokens.accessToken });
    });
  });

  describe('refresh', () => {
    it('generates tokens from the refresh payload, sets the refresh cookie and returns the access token', async () => {
      authService.generateTokens.mockResolvedValue(tokens);
      const user = { sub: '1', email: 'test@example.com' };

      const result = await authController.refresh(user, res);

      expect(authService.generateTokens).toHaveBeenCalledWith({ email: user.email, id: user.sub });
      expectRefreshCookieToBeSet();
      expect(result).toEqual({ token: tokens.accessToken });
    });
  });

  describe('logout', () => {
    it('clears the refresh cookie and returns a success result', async () => {
      const result = await authController.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(result).toEqual({ result: true });
    });
  });
});
