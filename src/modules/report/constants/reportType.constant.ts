import { Prisma } from '@prisma/client';
import { IEntityResponse, TEntityBlock } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const ReportTypesColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'code', name: 'Код', type: 'string', filtrable: true },
  { code: 'name', name: 'Название', type: 'string', filtrable: true },
  { code: 'description', name: 'Описание', type: 'string', filtrable: true },
  { code: 'createdAt', name: 'Дата создания', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
] as const;

export const ReportTypesBlocks: TEntityBlock[] = [
  { code: 'main', name: 'Тип отчета', columnCapacity: 6, maxColumns: 2, blockType: 'table' },
];

export const ReportTypesBlockDetails: IEntityResponse['blockDetails'] = [
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
        title: 'Код',
        editable: true,
        path: 'code',
        type: 'string',
        required: true,
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
        required: true,
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

export const ReportTypesSelect: Prisma.ReportTypeSelect = {
  id: true,
  code: true,
  name: true,
  description: true,
  configSchema: true,
  detailConfig: true,
  createdAt: true,
};
