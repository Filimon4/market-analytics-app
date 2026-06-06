import { IBlock, IEntityResponse, TEntityBlock } from 'src/common/interfaces/ientity.interface';

export const ProjectBlocks: TEntityBlock[] = [
  { code: 'main', name: 'Проект', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
];

export const ProjectBlockDetails: IEntityResponse['blockDetails'] = [
  {
    blockCode: 'main',
    fields: [
      {
        editable: false,
        path: 'id',
        title: 'Инд.',
        type: 'string',
      },
      {
        editable: true,
        path: 'name',
        title: 'Название',
        type: 'string',

        required: true,
      },
      {
        editable: true,
        path: 'description',
        title: 'Описапние',
        type: 'string',

        required: true,
      },
    ],
  },
];
