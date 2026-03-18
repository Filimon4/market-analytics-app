import { Prisma } from '@prisma/client';
import { UsersToProjectSelect } from '../constants/user.constant';

export type TUsersToProjectGetPayload = Prisma.UserToProjectGetPayload<{
  select: typeof UsersToProjectSelect;
}>;

export type TUsersToProjectResponse = Omit<TUsersToProjectGetPayload, 'id'> & {
  id: string;
};
