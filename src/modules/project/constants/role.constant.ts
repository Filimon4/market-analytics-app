import { IBlock } from "src/common/interfaces/ientity.interface";
import { ITableColumn } from "src/common/interfaces/itable.interface";

export const RolesColumns: ITableColumn[] = [
  {code: 'id', name: "Инд.", type: 'number'},
  {code: "code", name: 'Код роли', type: 'string'},
  {code: "default", name: 'Системный', type: 'boolean'},
]

export const RolesBlocks: IBlock[] = [
  {type: "main", name: "Роль", columnCapacity: 5}
]