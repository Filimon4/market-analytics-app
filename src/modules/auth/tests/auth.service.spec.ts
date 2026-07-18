import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import type { User } from '@prisma/client';
import { EncryptionService } from '@src/common/utils/encryption/encryption.service';
import { JwtService } from '@src/common/utils/jwt/jwt.service';

import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: BigInt(1),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: EncryptionService,
          useValue: {
            encrypt: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAccessToken: jest.fn(),
            signRefreshToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    encryptionService = module.get(EncryptionService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('returns the user when the email exists and the password matches', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      encryptionService.compare.mockReturnValue(true);

      const result = await authService.validateUser('test@example.com', 'plain-password');

      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(encryptionService.compare).toHaveBeenCalledWith('plain-password', mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('returns null when no user is found for the email', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser('missing@example.com', 'plain-password');

      expect(result).toBeNull();
      expect(encryptionService.compare).not.toHaveBeenCalled();
    });

    it('returns null when the password does not match', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);
      encryptionService.compare.mockReturnValue(false);

      const result = await authService.validateUser('test@example.com', 'wrong-password');

      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('signs and returns an access token and a refresh token', async () => {
      jwtService.signAccessToken.mockReturnValue('access-token');
      jwtService.signRefreshToken.mockReturnValue('refresh-token');

      const result = await authService.generateTokens({ email: mockUser.email, id: mockUser.id.toString() });

      expect(jwtService.signAccessToken).toHaveBeenCalledWith({ email: mockUser.email, sub: mockUser.id.toString() });
      expect(jwtService.signRefreshToken).toHaveBeenCalledWith({ email: mockUser.email, sub: mockUser.id.toString() });
      expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });
  });

  describe('refreshAccess', () => {
    it('verifies the refresh token and signs a new access token', async () => {
      const decodedPayload = { sub: mockUser.id.toString(), email: mockUser.email };
      jwtService.verifyRefreshToken.mockReturnValue(decodedPayload);
      jwtService.signAccessToken.mockReturnValue('new-access-token');

      const result = await authService.refreshAccess('some-refresh-token');

      expect(jwtService.verifyRefreshToken).toHaveBeenCalledWith('some-refresh-token');
      expect(jwtService.signAccessToken).toHaveBeenCalledWith(decodedPayload);
      expect(result).toBe('new-access-token');
    });
  });

  describe('signup', () => {
    it('creates a user and returns tokens when the email is not taken', async () => {
      userService.findByEmail.mockRejectedValue(new Error('not found'));
      encryptionService.encrypt.mockReturnValue('encrypted-password');
      userService.create.mockResolvedValue(mockUser);
      jwtService.signAccessToken.mockReturnValue('access-token');
      jwtService.signRefreshToken.mockReturnValue('refresh-token');

      const result = await authService.signup('Test User', 'test@example.com', 'plain-password');

      expect(encryptionService.encrypt).toHaveBeenCalledWith('plain-password');
      expect(userService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        password: 'encrypted-password',
      });
      expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    it('throws BadRequestException when a user with the given email already exists', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.signup('Test User', 'test@example.com', 'plain-password')).rejects.toThrow(BadRequestException);
      expect(userService.create).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when user creation fails', async () => {
      userService.findByEmail.mockRejectedValue(new Error('not found'));
      encryptionService.encrypt.mockReturnValue('encrypted-password');
      userService.create.mockRejectedValue(new Error('db error'));

      await expect(authService.signup('Test User', 'test@example.com', 'plain-password')).rejects.toThrow(BadRequestException);
    });
  });
});
