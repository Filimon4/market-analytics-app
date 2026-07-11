import { UnauthorizedException } from '@nestjs/common';
import type { User } from '@prisma/client';

import { AuthService } from '../../auth.service';
import { LocalStrategy } from '../../strategies/local.strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: BigInt(1),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    strategy = new LocalStrategy(authService);
  });

  it('returns the user with a stringified id when credentials are valid', async () => {
    authService.validateUser.mockResolvedValue(mockUser);

    const result = await strategy.validate('test@example.com', 'plain-password');

    expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'plain-password');
    expect(result).toEqual({ ...mockUser, id: mockUser.id.toString() });
  });

  it('throws UnauthorizedException when credentials are invalid', async () => {
    authService.validateUser.mockResolvedValue(null);

    await expect(strategy.validate('test@example.com', 'wrong-password')).rejects.toThrow(UnauthorizedException);
  });
});
