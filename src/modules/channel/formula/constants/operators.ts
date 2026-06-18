import { FormulaPaletteItem } from '@src/modules/channel/formula/formula.helpers';

export const DefaultOperators: Omit<FormulaPaletteItem, 'fType'>[] = [
  {
    label: ')',
    value: 'close_parenthesis',
  },
  {
    label: '(',
    value: 'open_parenthesis',
  },
  {
    label: '*',
    value: 'multiply',
  },
  {
    label: '/',
    value: 'divide',
  },
  {
    label: '+',
    value: 'add',
  },
  {
    label: '-',
    value: 'subtract',
  },
  {
    label: '%',
    value: 'modulo',
  },
  {
    label: '^',
    value: 'power',
  },
];

export const ChannelPerformanceOperators: Omit<FormulaPaletteItem, 'fType'>[] = [
  {
    label: 'Клики',
    value: 'clicks',
  },
  {
    label: 'Кол-во просмотров',
    value: 'impressions',
  },
  {
    label: 'Общие траты',
    value: 'spend',
  },
  {
    label: 'Конверсия',
    value: 'conversions',
  },
  {
    label: 'Кол-во лидов',
    value: 'leads',
  },
];
