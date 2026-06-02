export interface IBlockIndentifier {
  blockCode: string;
}

export interface IBlock {
  code: string;
  name: string;
  columnCapacity: number;
  maxColumns: number;
  blockType: 'table' | 'tree';

  // Поля для добавления
  createHide?: true; // При добавлениии блок будет скрыт
}

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
  blocks: IBlock[];
  blockDetails: (IBlockDetail | IBlockTreeDetail)[];
  data: B;
}

export interface ICreateEntityResponse {
  id: string;
}
