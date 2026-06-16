import { Prisma } from '@prisma/client';
import { TEntityBlock, TEntityBlockDetail } from '@src/common/interfaces/ientity.interface';

export const UfChannelsBlocks: TEntityBlock[] = [
  {
    code: 'main',
    name: 'Свойства канала трафика',
    columnCapacity: 5,
    maxColumns: 2,
    blockType: 'table',
  },
];

export const UfChannelsBlockDetails: TEntityBlockDetail = [
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
        title: 'Код',
        editable: true,
        path: 'code',
        type: 'string',

        required: true,
      },
      // TODO: Переделать на select
      {
        title: 'Тип',
        editable: true,
        path: 'type',
        type: 'string',

        required: true,
      },
      {
        title: 'Обязательное',
        editable: true,
        path: 'required',
        type: 'boolean',
        createDefault: false,
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

export const UfChannelsSelect: Prisma.UfChannelSelect = {
  id: true,
  type: true,
  name: true,
  code: true,
  required: true,
  deleted: true,
};
