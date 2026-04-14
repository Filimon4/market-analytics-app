import { Prisma } from '@prisma/client';
import { IBlock, IBlockDetail } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const UsersToProjectSelect: Prisma.UserToProjectSelect = {
  id: true,
  blocked: true,
  userRole: {
    select: {
      id: true,
      title: true,
      code: true,
    },
  },
  user: {
    select: {
      name: true,
      email: true,
    },
  },
};

export const UserToProjectColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'role', name: 'Роль', type: 'select', selectUrl: 'title', path: 'userRole.title', filtrable: true },
  { code: 'userName', name: 'Имя пользователя', type: 'string', path: 'user.name', filtrable: true },
  { code: 'userEmail', name: 'Почта пользователя', type: 'string', path: 'user.email', filtrable: true },
  { code: 'blocked', name: 'Заблокирован', type: 'boolean', filtrable: true },
];

export const UserToProjectBlocks: IBlock[] = [
  { code: 'main', name: 'Пользователь', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
];

export const UserToProjectBlockDetails: IBlockDetail[] = [
  {
    blockCode: 'main',
    fields: [
      {
        path: 'id',
        title: 'Инд.',
        editable: false,
        type: 'number',
      },
      {
        path: 'user.name',
        editable: true,
        title: 'Имя пользователя',
        type: 'string',
        editPath: 'userName',

        required: true,
      },
      {
        path: 'user.email',
        editable: true,
        title: 'Почта пользователя',
        type: 'string',
        editPath: 'userEmail',

        required: true,
      },
      {
        path: 'userRole.code',
        editable: true,
        type: 'select',
        selectUrl: '',
        title: 'Роль',
        editPath: 'userRoleId',

        required: true,
      },
      {
        path: 'blocked',
        editable: true,
        title: 'Заблокирован',
        type: 'boolean',
        editPath: 'blocked',

        createDefault: false,
        createEditable: false,
      },
    ],
  },
];
