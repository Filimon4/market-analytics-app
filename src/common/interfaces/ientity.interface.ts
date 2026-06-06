export interface IBlockIndentifier {
  blockCode: string;
}

export interface ITreeBlock extends IBlock {
  blockType: 'tree';
}

export interface ITableBlock extends IBlock {
  columnCapacity: number;
  maxColumns: number;
  blockType: 'table';
}

export interface IAnalyticBlock extends IBlock {
  blockType: 'analytics';
}

export interface IMetricBlock extends IBlock {
  blockType: 'metrics';
}

export interface IBlock {
  code: string;
  name: string;
  /**
   * Добавление
   *
   * При добавлениии блок будет скрыт
   */
  createHide?: true;
}

export type TEntityBlock = ITreeBlock | ITableBlock | IAnalyticBlock | IMetricBlock;

export interface IField {
  title: string;
  editable: boolean;
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select';
  path: string;
  editPath?: string;

  /**
   * Поле для select
   *
   * Получение данных для выбора
   */
  selectUrl?: string;

  /**
   * Поле для добаления
   *
   * Обязательно заполнение при добавлении
   */
  required?: true;
  /**
   * Поле для добаления
   *
   * При добавлении можно ли менять. Перекрывает editable
   */
  createEditable?: boolean;
  /**
   * Поле для добаления
   *
   * При добавлении дефолтное значение. Если поле только для отображение (editable: false) то можно добавить дефолтное значение
   * */
  createDefault?: boolean | string | number;
}

export interface IBlockDetail extends IBlockIndentifier {
  fields: IField[];
}

export interface IBlockTreeDetail extends IBlockIndentifier {
  treePath: string;
}

export interface IEntityResponse<B = Record<string, any>> {
  blocks: TEntityBlock[];
  blockDetails: (IBlockDetail | IBlockTreeDetail)[];
  data: B;
}

export interface ICreateEntityResponse {
  id: string;
}
