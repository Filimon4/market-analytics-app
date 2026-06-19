import { Prisma } from '@prisma/client';
import { TEntityBlock, ITableBlockDetail } from 'src/common/interfaces/ientity.interface';
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
  {
    code: 'main',
    name: 'Канал трафика',
    columnCapacity: 5,
    maxColumns: 2,
    blockType: 'table',
  },
  {
    code: 'properties',
    name: 'Свойства',
    blockType: 'listEntity',
    metricUrls: {
      tableUrl: 'v1/channels/:parentId/uf-channels/table/list',
    },
    baseEntityUrl: 'uf-channels',
    createHide: true,
    actions: [
      {
        title: 'Добавить новое свойство',
        code: 'new',
        size: 'medium',
        type: 'logic',
      },
    ],
    tableColumns: [
      {
        key: 'id',
        title: 'Инд.',
        path: 'id',
      },
      {
        key: 'name',
        title: 'Название',
        path: 'name',
      },
      {
        key: 'value',
        title: 'Значение',
        path: 'value',
      },
    ],
  },
  {
    code: 'metrics',
    name: 'Метрики',
    blockType: 'listEntity',
    metricUrls: {
      tableUrl: 'v1/channels/:parentId/metrics/table/list',
    },
    baseEntityUrl: 'metrics',
    createHide: true,
    actions: [
      {
        title: 'Обновить метрики по трафику',
        code: 'updateMetricsOfChannel',
        size: 'medium',
        type: 'directRequest',
        requestUrl: 'v1/channels/:entityId/update-metrics',
      },
      {
        title: 'Добавить новую метрику',
        code: 'new',
        size: 'medium',
        type: 'logic',
      },
    ],
    tableColumns: [
      {
        key: 'id',
        title: 'Инд.',
        path: 'id',
      },
      {
        key: 'name',
        title: 'Название',
        path: 'name',
      },
    ],
  },
];

export const ChannelsBlockDetails: ITableBlockDetail[] = [
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
