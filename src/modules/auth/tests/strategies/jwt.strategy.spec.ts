import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

import { JwtStrategy } from '../../strategies/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('jwt-secret'),
    } as unknown as jest.Mocked<ConfigService>;

    strategy = new JwtStrategy(configService);
  });

  it('reads JWT_SECRET from the config service on construction', () => {
    expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('returns the user id and email when the payload has a sub claim', async () => {
    const result = await strategy.validate({ sub: '1', email: 'test@example.com' });

    expect(result).toEqual({ id: '1', email: 'test@example.com' });
  });

  it('throws UnauthorizedException when the payload has no sub claim', async () => {
    await expect(strategy.validate({ email: 'test@example.com' })).rejects.toThrow(UnauthorizedException);
  });
});
