import { Prisma } from '@prisma/client';
import { TEntityBlock, IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const ChannelPerformancesColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  {
    code: 'channel',
    name: 'Канал',
    type: 'select',
    selectUrl: '/v1/channels/select?deleted=false',
    filtrable: true,
    path: 'channel.name',
  },
  { code: 'startDate', name: 'Дата начала', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'endDate', name: 'Дата окончания', type: 'datetime', filtrable: false },
  { code: 'spend', name: 'Расходы', type: 'number', filtrable: false },
  { code: 'impressions', name: 'Показы', type: 'number', filtrable: false },
  { code: 'clicks', name: 'Клики', type: 'number', filtrable: false },
  { code: 'conversions', name: 'Конверсии', type: 'number', filtrable: false },
  { code: 'leads', name: 'Лиды', type: 'number', filtrable: false },
  { code: 'createdAt', name: 'Дата создания', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'deleted', name: 'Удален', type: 'boolean', filtrable: true },
] as const;

export const ChannelPerformancesBlocks: TEntityBlock[] = [
  { code: 'main', name: 'Результативность канала', columnCapacity: 6, maxColumns: 2, blockType: 'table' },
  { code: 'metrics', name: 'Метрики', blockType: 'metrics', createHide: true },
];

export const ChannelPerformancesBlockDetails: IEntityResponse['blockDetails'] = [
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
        title: 'Канал',
        editable: true,
        path: 'channel',
        type: 'select',
        selectUrl: '/v1/channels/select',
        required: true,
      },
      {
        title: 'Дата начала',
        editable: true,
        path: 'startDate',
        type: 'datetime',
        required: true,
      },
      {
        title: 'Дата окончания',
        editable: true,
        path: 'endDate',
        type: 'datetime',
        required: true,
      },
      {
        title: 'Расходы',
        editable: true,
        path: 'spend',
        type: 'number',
        createDefault: 0,
      },
      {
        title: 'Показы',
        editable: true,
        path: 'impressions',
        type: 'number',
        createDefault: 0,
      },
      {
        title: 'Клики',
        editable: true,
        path: 'clicks',
        type: 'number',
        createDefault: 0,
      },
      {
        title: 'Конверсии',
        editable: true,
        path: 'conversions',
        type: 'number',
        createDefault: 0,
      },
      {
        title: 'Лиды',
        editable: true,
        path: 'leads',
        type: 'number',
        createDefault: 0,
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

export const ChannelPerformancesSelect: Prisma.ChannelPerformanceSelect = {
  id: true,
  startDate: true,
  endDate: true,
  spend: true,
  impressions: true,
  clicks: true,
  conversions: true,
  leads: true,
  ufMetrics: true,
  createdAt: true,
  deleted: true,
  channel: {
    select: {
      id: true,
      name: true,
    },
  },
};
