import { Prisma } from "@prisma/client"

export const UsersToProjectSelect: Prisma.UserToProjectSelect = {
  id: true,
  blocked: true,
  userRole: {
    select: {
      id: true,
    }
  },
  user: {
    select: {
      name: true,
      email: true,
    }
  }
}

export type TUsersToProjectGetPayload = Prisma.UserToProjectGetPayload<{
  select: {
    id: true,
    blocked: true,
    userRole: {
      select: {
        id: true,
      }
    },
    user: {
      select: {
        name: true,
        email: true,
      }
    }
  }
}>

export type TUsersToProjectRequest = Omit<TUsersToProjectGetPayload, 'id' | 'userRole' | 'user'> & {
  id: string,
  roleId: number,
  userName: string,
  userEmail: string
}

export type TUsersToProjectResponse = Omit<TUsersToProjectGetPayload, 'id'> & {
  id: string
}