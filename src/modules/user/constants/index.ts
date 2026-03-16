import { IBlock, IBlockDetail } from "src/common/interfaces/ientity.interface";

export const UserBlocks: IBlock[] = [
  {name: "Пользователь", code: 'main', columnCapacity: 5, maxColumns: 2, blockType: 'table'},
  {name: "Проект", code: 'project', columnCapacity: 5, maxColumns: 1, blockType: 'table'},
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
        path: 'userToProject.project.name',
        editable: false,
        type: 'string',
      },
      {
        title: "Роль в проекте",
        path: 'userToProject.userRole.title',
        editable: false,
        type: 'string',
      },
      {
        title: "Дата входа",
        path: 'userToProject.createdAt',
        editable: false,
        type: 'datetime',
      },
      {
        title: "Заблокирован",
        path: 'userToProject.blocked',
        editable: false,
        type: 'boolean',
      }
    ],
    blockCode: 'project'
  },
]
