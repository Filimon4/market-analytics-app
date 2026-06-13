import { Prisma } from '@prisma/client';
import { TEntityBlock, TEntityBlockDetail } from '@src/common/interfaces/ientity.interface';

export const MetricsChannelBlocks: TEntityBlock[] = [
  {
    code: 'main',
    name: 'Метрика канала трафика',
    columnCapacity: 5,
    maxColumns: 2,
    blockType: 'table',
  },
];

export const MetricsChannelBlockDetails: TEntityBlockDetail = [
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
        title: 'Формула',
        editable: true,
        path: 'formula',
        type: 'string',

        required: true,
      },
      {
        title: 'Код',
        editable: true,
        path: 'code',
        type: 'string',

        required: true,
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

export const MetricsChannelSelect: Prisma.MetricChannelSelect = {
  id: true,
  name: true,
  code: true,
  deleted: true,
  formula: true,
};
