import { AuthGuard } from '@nestjs/passport';

import { LocalAuthGuard } from '../../guards/local-auth.guard';

// LocalAuthGuard has no logic of its own — it only binds the 'local' Passport
// strategy via AuthGuard(). A behavioral test would require bootstrapping the
// full Passport strategy (effectively an e2e test), so this is a smoke test
// confirming the guard is wired to the expected strategy.
describe('LocalAuthGuard', () => {
  it('extends the Passport AuthGuard', () => {
    const guard = new LocalAuthGuard();

    expect(guard).toBeInstanceOf(AuthGuard('local'));
  });
});
