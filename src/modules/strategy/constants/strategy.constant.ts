import { Prisma } from '@prisma/client';
import { IBlock, IEntityResponse, TEntityBlock } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const StrategiesColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'name', name: 'Название', type: 'string', filtrable: true },
  { code: 'description', name: 'Описание', type: 'string', filtrable: true },
  { code: 'createdAt', name: 'Дата создания', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'deleted', name: 'Удалена', type: 'boolean', filtrable: true },
] as const;

export const StrategiesBlocks: TEntityBlock[] = [
  { code: 'main', name: 'Стратегия', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
  { code: 'analytics', name: 'Аналитика', blockType: 'analytics', createHide: true },
];

export const StrategiesBlockDetails: IEntityResponse['blockDetails'] = [
  {
    blockCode: 'main',
    fields: [
      {
        title: 'Инд.',
        editable: false,
        path: 'id',
        type: 'string',
      },
      {
        title: 'Название',
        editable: true,
        path: 'name',
        type: 'string',
        required: true,
      },
      {
        title: 'Описание',
        editable: true,
        path: 'description',
        type: 'string',
      },
      {
        title: 'Дата создания',
        editable: false,
        path: 'createdAt',
        type: 'datetime',
      },
      {
        title: 'Удалена',
        editable: false,
        path: 'deleted',
        type: 'boolean',
        createDefault: false,
      },
    ],
  },
];

export const StrategiesSelect: Prisma.StrategySelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  deleted: true,
};
