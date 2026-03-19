import { Prisma } from '@prisma/client';
import { IBlock, IBlockDetail, IBlockTreeDetail, IEntity } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const RolesColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'title', name: 'Название роли', type: 'string', filtrable: true },
  { code: 'code', name: 'Код роли', type: 'string', filtrable: true },
  { code: 'default', name: 'Системный', type: 'boolean', filtrable: true },
] as const;

export const RolesBlocks: IBlock[] = [
  { code: 'main', name: 'Роль', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
  { code: 'permissions', name: 'Доступы', columnCapacity: 5, maxColumns: 2, blockType: 'tree', createHide: true },
];

export const RolesBlockDetails: IEntity['blockDetails'] = [
  {
    blockCode: 'main',
    fields: [
      {
        title: 'Инд.',
        editable: false,
        path: 'id',
        type: 'number',
      },
      {
        editable: true,
        path: 'title',
        title: 'Название',
        type: 'string',
        editPath: 'title',

        required: true,
      },
      {
        editable: true,
        path: 'code',
        title: 'Код роли',
        type: 'string',
        editPath: 'code',

        required: true,
      },
      {
        editable: false,
        path: 'default',
        title: 'Системаня роль',
        type: 'boolean',

        createDefault: false,
      },
    ],
  },
  {
    blockCode: 'permissions',
    treePath: 'permissionTree',
  },
];

export const RolesSelect: Prisma.RoleSelect = {
  id: true,
  code: true,
  default: true,
  title: true,
};
