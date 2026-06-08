import { Prisma } from '@prisma/client';
import { TEntityBlock, IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const ChannelsColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'name', name: 'Название', type: 'string', filtrable: true },
  {
    code: 'strategy',
    name: 'Стратегия',
    type: 'select',
    selectUrl: '/v1/strategies/select',
    filtrable: true,
    path: 'strategy.name',
  },
  {
    code: 'trafficSource',
    name: 'Источник трафика',
    type: 'select',
    selectUrl: '/v1/channel-sources/select',
    filtrable: true,
    path: 'trafficSource.name',
  },
  { code: 'createdAt', name: 'Дата создания', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'deleted', name: 'Удален', type: 'boolean', filtrable: true },
] as const;

export const ChannelsBlocks: TEntityBlock[] = [
  { code: 'main', name: 'Канал трафика', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
  { code: 'metrics', name: 'Метрики', blockType: 'metrics', createHide: true },
  { code: 'analytics', name: 'Аналитика', blockType: 'analytics', createHide: true },
];

export const ChannelsBlockDetails: IEntityResponse['blockDetails'] = [
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
        title: 'Стратегия',
        editable: true,
        path: 'strategy',
        type: 'select',
        selectUrl: '/v1/strategies/select',
        required: true,
      },
      {
        title: 'Источник трафика',
        editable: true,
        path: 'trafficSource',
        type: 'select',
        selectUrl: '/v1/channel-sources/select',
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

export const ChannelsSelect: Prisma.ChannelSelect = {
  id: true,
  name: true,
  createdAt: true,
  deleted: true,
  strategy: {
    select: {
      id: true,
      name: true,
    },
  },
  trafficSource: {
    select: {
      id: true,
      name: true,
    },
  },
};
