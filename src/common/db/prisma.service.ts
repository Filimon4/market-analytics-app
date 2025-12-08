import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prismaClient/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({ adapter: pool });
  }
}
