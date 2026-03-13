import { Prisma } from "@prisma/client";
import { IBlock, IBlockDetail } from "src/common/interfaces/ientity.interface";

export const UserBlocks: IBlock[] = [
  {name: "Пользователь", code: 'main', columnCapacity: 5, maxColumns: 2},
  {name: "Проект", code: 'project', columnCapacity: 5, maxColumns: 1},
]

export const UserBlockDetails: IBlockDetail[] = [
  {
    fields: [
      {
        title: "Имя",
        path: 'user.name',
        editable: true,
        type: 'string',
        editPath: 'name'
      },
      {
        title: "Почта",
        path: 'user.email',
        editable: true,
        type: 'string',
        editPath: 'email'
      },
      {
        title: "Дата регистрации",
        path: 'user.createdAt',
        editable: false,
        type: 'datetime',
      },
    ],
    blockCode: 'main'
  },
  {
    fields: [
      {
        title: "Текущий проект",
        path: 'project.name',
        editable: false,
        type: 'string',
      },
      {
        title: "Роль в проекте",
        path: 'userRole.title',
        editable: false,
        type: 'string',
      },
      {
        title: "Дата входа",
        path: 'createdAt',
        editable: false,
        type: 'datetime',
      },
      {
        title: "Заблокирован",
        path: 'blocked',
        editable: false,
        type: 'boolean',
      }
    ],
    blockCode: 'project'
  },
]
