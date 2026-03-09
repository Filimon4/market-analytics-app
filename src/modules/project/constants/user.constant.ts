import { IBlock } from "src/common/interfaces/ientity.interface"
import { ITableColumn } from "src/common/interfaces/itable.interface"

export const UserToProjectColumns: ITableColumn[] = [
  {code: 'id', name: 'Инд.', type: 'number'},
  {code: 'blocked', name: "Заблокирован", type: "boolean"},
  {code: 'roleId', name: 'Роль', type: 'link', linkUrl: '', path: 'userRole.id'},
  {code: 'userName', name: 'Имя пользователя', type: 'string', path: 'user.name'},
  {code: 'userEmail', name: 'Почта пользователя', type: 'string', path: 'user.email'}
]

export const UserToProjectBlocks: IBlock[] = [
  {type: "main", name: "Пользователь", columnCapacity: 5}
]