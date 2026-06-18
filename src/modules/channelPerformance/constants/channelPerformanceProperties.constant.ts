import { TEntityBlock, IEntityResponse } from 'src/common/interfaces/ientity.interface';

export const ChannelPerformancePropertiesBlocks: TEntityBlock[] = [
  { code: 'main', name: 'Свойство', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
];

export const ChannelPerformancePropertiesBlockDetails: IEntityResponse['blockDetails'] = [
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
        editable: false,
        path: 'name',
        type: 'string',
      },
      {
        title: 'Значение',
        editable: true,
        path: 'value',
        type: 'number',
      },
    ],
  },
];
