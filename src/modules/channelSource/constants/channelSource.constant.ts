import { Prisma } from '@prisma/client';
import { IBlock, IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const ChannelSourcesColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'name', name: 'Название', type: 'string', filtrable: true },
  { code: 'createdAt', name: 'Дата создания', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'deleted', name: 'Удален', type: 'boolean', filtrable: true },
] as const;

export const ChannelSourcesBlocks: IBlock[] = [
  { code: 'main', name: 'Источник трафика', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
];

export const ChannelSourcesBlockDetails: IEntityResponse['blockDetails'] = [
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
        title: 'Дата создания',
        editable: false,
        path: 'createdAt',
        type: 'datetime',
      },
      {
        title: 'Удален',
        editable: false,
        path: 'deleted',
        type: 'boolean',
        createDefault: false,
      },
    ],
  },
];

export const ChannelSourcesSelect: Prisma.ChannelSourceSelect = {
  id: true,
  name: true,
  createdAt: true,
  deleted: true,
};
