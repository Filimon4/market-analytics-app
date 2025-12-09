import { User } from '@prisma/client';
import { ApiKey } from '@prismaClient/prisma';
import 'express';

declare module 'express' {
  export interface Request {
    apiKey?: ApiKey;
    user?: User;
  }
}
