import { Prisma } from "@prisma/client";
import { IBlock } from "src/common/interfaces/ientity.interface";
import { ITableColumn } from "src/common/interfaces/itable.interface";

export const RolesColumns: ITableColumn[] = [
  {code: "id", name: "Инд.", type: 'number', filtrable: false},
  {code: "code", name: 'Код роли', type: 'string', filtrable: true},
  {code: "default", name: 'Системный', type: 'boolean', filtrable: true},
] as const; 
  
export const RolesBlocks: IBlock[] = [
  {code: "main", name: "Роль", columnCapacity: 5, maxColumns: 2}
]

export const RolesSelect: Prisma.RoleSelect = {
  id: true,
  code: true,
  default: true
}