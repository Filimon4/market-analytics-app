import { Prisma, User, UserToProject } from '@prisma/client';
import 'express';

type ApiKeyWithOwner = Prisma.ApiKeyGetPayload<{
  include: {
    createdBy: {
      include: {
        user: true;
      };
    };
  };
}>;

declare module 'express' {
  export interface Request {
    apiKey?: ApiKeyWithOwner;
    user?: User;
    projectUser?: UserToProject;
    tenantId?: string;
  }
}
