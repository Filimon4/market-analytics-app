import { $Enums, Prisma } from '@prisma/client';
import { IEntityResponse, TEntityBlock } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const ReportsColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'name', name: 'Название', type: 'string', filtrable: true },
  { code: 'slug', name: 'Слаг', type: 'string', filtrable: true },
  {
    code: 'reportType',
    name: 'Тип отчета',
    type: 'select',
    selectUrl: '/v1/report-types/select',
    filtrable: true,
    path: 'reportType.name',
  },
  {
    code: 'visibility',
    name: 'Видимость',
    type: 'constants',
    filtrable: true,
    constantList: Object.values($Enums.ReportVisibility),
  },
  { code: 'dateFrom', name: 'Дата начала', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'dateTo', name: 'Дата окончания', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'createdAt', name: 'Дата создания', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'deleted', name: 'Удален', type: 'boolean', filtrable: true },
] as const;

export const ReportsBlocks: TEntityBlock[] = [
  { code: 'main', name: 'Отчет', columnCapacity: 6, maxColumns: 2, blockType: 'table', actions: [] },
];

export const ReportsBlockDetails: IEntityResponse['blockDetails'] = [
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
        title: 'Алиас',
        editable: true,
        path: 'slug',
        type: 'string',
      },
      {
        title: 'Тип отчета',
        editable: true,
        path: 'reportType',
        type: 'select',
        selectUrl: '/v1/report-types/select',
        required: true,
      },
      {
        title: 'Дата начала',
        editable: true,
        path: 'dateFrom',
        type: 'datetime',
        required: true,
      },
      {
        title: 'Дата окончания',
        editable: true,
        path: 'dateTo',
        type: 'datetime',
        required: true,
      },
      {
        title: 'Видимость',
        editable: true,
        path: 'visibility',
        type: 'select',
        selectUrl: '/v1/reports/visibility/select',
        required: true,
      },
      {
        title: 'Создал',
        editable: false,
        path: 'createdBy.user.email',
        type: 'string',
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

export const ReportsSelect: Prisma.ReportSelect = {
  id: true,
  name: true,
  slug: true,
  dateFrom: true,
  dateTo: true,
  visibility: true,
  createdAt: true,
  deleted: true,
  config: true,
  createdBy: {
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  },
};
