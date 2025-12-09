import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class ClientMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        req.user = null;
        return;
      }

      const user = await this.prisma.user.findUnique({
        where: { id: BigInt(userId) },
      });

      req.user = user ?? null;
    } catch (error) {
      req.user = null;
    } finally {
      next();
    }
  }
}
