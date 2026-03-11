import { IBlock } from "src/common/interfaces/ientity.interface"
import { ITableColumn } from "src/common/interfaces/itable.interface"

export const UserToProjectColumns: ITableColumn[] = [
  {code: 'id', name: 'Инд.', type: 'number', filtrable: false},
  {code: 'blocked', name: "Заблокирован", type: "boolean", filtrable: true},
  {code: 'role', name: 'Роль', type: 'link', linkUrl: '', path: 'userRole.id', filtrable: true},
  {code: 'userName', name: 'Имя пользователя', type: 'string', path: 'user.name', filtrable: true},
  {code: 'userEmail', name: 'Почта пользователя', type: 'string', path: 'user.email', filtrable: true}
]

export const UserToProjectBlocks: IBlock[] = [
  {type: "main", name: "Пользователь", columnCapacity: 5}
]