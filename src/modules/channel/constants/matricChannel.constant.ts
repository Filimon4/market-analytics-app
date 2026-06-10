import { Prisma } from '@prisma/client';
import { IMetricsBlockDetail } from '@src/common/interfaces/ientity.interface';

export const MetricsChannelBlockDetail: IMetricsBlockDetail = {
  fields: [
    {
      title: 'Инд.',
      editable: false,
      path: 'id',
      type: 'string',
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
};

export const MetricsChannelSelect: Prisma.MetricChannelSelect = {
  id: true,
  name: true,
  code: true,
  deleted: true,
};
