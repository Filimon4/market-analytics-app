import { Prisma } from '@prisma/client';
import { IBlock, IEntity } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const ApiKeysColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'name', name: 'Название ключа', type: 'string', filtrable: true },
  { code: 'key', name: 'Код ключа', type: 'string', filtrable: true },
  { code: 'scope', name: 'Доступ ключа', type: 'string', filtrable: true },
  { code: 'status', name: 'Статус ключа', type: 'select', selectUrl: '', filtrable: true, path: 'status.code' },
  { code: 'expiresAt', name: 'Срок дейтсвия', type: 'string', filtrable: false }, // TODO: Добавить datetime фильтр
  { code: 'createdAt', name: 'Дата создания', type: 'string', filtrable: false },
] as const;

export const ApiKeysBlocks: IBlock[] = [
  { code: 'main', name: 'Апи ключ', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
];

export const ApiKeysBlockDetails: IEntity['blockDetails'] = [
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
        title: 'Название',
        editable: true,
        path: 'name',
        type: 'string',
        editPath: 'name',
      },
      {
        title: 'Код апи ключа',
        editable: true,
        path: 'key',
        type: 'string',
        editPath: 'key',
      },
      {
        title: 'Доступ апи ключа',
        editable: true,
        path: 'scope',
        type: 'string',
        editPath: 'scope',
      },
      {
        title: 'Статус апи ключа',
        editable: false,
        path: 'status',
        type: 'select',
        selectUrl: '',
        editPath: 'status',
      },
      {
        title: 'Срок действия',
        editable: false,
        path: 'expiresAt',
        type: 'datetime',
      },
      {
        title: 'Дата создания',
        editable: false,
        path: 'createdAt',
        type: 'datetime',
      },
    ],
  },
];

export const ApiKeysSelect: Prisma.ApiKeySelect = {
  id: true,
  name: true,
  key: true,
  scope: true,
  status: {
    select: {
      id: true,
      code: true,
    },
  },
  expiresAt: true,
  createdAt: true,
};
