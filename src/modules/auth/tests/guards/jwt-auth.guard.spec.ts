import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

// JwtAuthGuard has no logic of its own — it only binds the 'jwt' Passport
// strategy via AuthGuard(). A behavioral test would require bootstrapping the
// full Passport strategy (effectively an e2e test), so this is a smoke test
// confirming the guard is wired to the expected strategy.
describe('JwtAuthGuard', () => {
  it('extends the Passport AuthGuard', () => {
    const guard = new JwtAuthGuard();

    expect(guard).toBeInstanceOf(AuthGuard('jwt'));
  });
});
