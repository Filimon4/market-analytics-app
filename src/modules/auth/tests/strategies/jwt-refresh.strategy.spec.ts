import type { ConfigService } from '@nestjs/config';

import { JwtRefreshStrategy } from '../../strategies/jwt-refresh.strategy';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('jwt-secret'),
    } as unknown as jest.Mocked<ConfigService>;

    strategy = new JwtRefreshStrategy(configService);
  });

  it('reads JWT_SECRET from the config service on construction', () => {
    expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('returns the payload as-is', async () => {
    const payload = { sub: '1', email: 'test@example.com' };

    const result = await strategy.validate(payload);

    expect(result).toBe(payload);
  });
});
