import { AuthGuard } from '@nestjs/passport';

import { JwtRefreshAuthGuard } from '../../guards/jwt-refresh-auth.guard';

// JwtRefreshAuthGuard has no logic of its own — it only binds the
// 'jwt-refresh' Passport strategy via AuthGuard(). A behavioral test would
// require bootstrapping the full Passport strategy (effectively an e2e
// test), so this is a smoke test confirming the guard is wired to the
// expected strategy.
describe('JwtRefreshAuthGuard', () => {
  it('extends the Passport AuthGuard', () => {
    const guard = new JwtRefreshAuthGuard();

    expect(guard).toBeInstanceOf(AuthGuard('jwt-refresh'));
  });
});
