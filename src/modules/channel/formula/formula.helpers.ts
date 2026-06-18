export type FormulaPaletteItem = {
  label: string | number;
  value: string;
  fType: string;
  color?: string;
};

export type NormalizedFormulaItem =
  | { fType: 'operator'; value: string }
  | { fType: 'builtin'; value: string }
  | { fType: 'uf-number'; value: string }
  | { fType: 'uf-channel'; ufChannelId: string };

export const OPERATOR_SYMBOLS: Record<string, string> = {
  open_parenthesis: '(',
  close_parenthesis: ')',
  multiply: '*',
  divide: '/',
  add: '+',
  subtract: '-',
  modulo: '%',
  power: '^',
};

export function normalizeFormulaItems(items: FormulaPaletteItem[]): NormalizedFormulaItem[] {
  return items.flatMap((item): NormalizedFormulaItem[] => {
    switch (item.fType) {
      case 'uf-channel':
        return item.value ? [{ fType: 'uf-channel', ufChannelId: String(item.value) }] : [];
      case 'operator':
        return [{ fType: 'operator', value: item.value }];
      case 'builtin':
        return [{ fType: 'builtin', value: item.value }];
      case 'uf-number':
        return [{ fType: 'uf-number', value: String(item.label) }];
      default:
        return [];
    }
  });
}

export function denormalizeFormulaItems(
  items: NormalizedFormulaItem[],
  ufChannelMap?: Map<bigint, { name: string }>,
): FormulaPaletteItem[] {
  return items.flatMap((item): FormulaPaletteItem[] => {
    switch (item.fType) {
      case 'uf-channel':
        return [
          {
            label: ufChannelMap?.get(BigInt(item.ufChannelId)).name || '',
            value: item.ufChannelId,
            fType: 'uf-channel',
            color: '#FFB269',
          },
        ];
      case 'operator':
        return [
          {
            label: OPERATOR_SYMBOLS[item.value] ?? item.value,
            value: item.value,
            fType: 'operator',
            color: '#224F7A',
          },
        ];
      case 'builtin':
        // TOOD: Вынести
        const builtinLabels: Record<string, string> = {
          clicks: 'Клики',
          impressions: 'Кол-во просмотров',
          spend: 'Общие траты',
          conversions: 'Конверсия',
          leads: 'Кол-во лидов',
        };
        return [
          {
            label: builtinLabels[item.value] ?? item.value,
            value: item.value,
            fType: 'builtin',
            color: '#B269FF',
          },
        ];
      case 'uf-number':
        return [
          {
            label: item.value,
            value: `uf-number-${item.value}`,
            fType: 'uf-number',
            color: '#FF4D85',
          },
        ];
      default:
        return [];
    }
  });
}

export function buildFormulaExpression(items: NormalizedFormulaItem[], ufChannelMap: Map<string, string>): string {
  return items
    .map((item) => {
      switch (item.fType) {
        case 'operator':
          return OPERATOR_SYMBOLS[item.value] ?? '';
        case 'builtin':
          return item.value;
        case 'uf-number':
          return item.value;
        case 'uf-channel':
          return ufChannelMap.get(item.ufChannelId) ?? '';
      }
    })
    .filter((token): token is string => Boolean(token))
    .join(' ');
}
