import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly saltRounds = bcrypt.genSaltSync(12);

  encrypt(text: string): string {
    return bcrypt.hashSync(text, this.saltRounds);
  }

  compare(plain: string, encrypted: string): boolean {
    return bcrypt.compareSync(plain, encrypted);
  }
}
