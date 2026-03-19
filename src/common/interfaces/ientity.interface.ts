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
  selectUrl?: string;

  // Поля для добаления
  required?: true; // Обязательно заполнение при добавлении
  createEditable?: boolean; // При добавлении можно ли менять. Перекрывает editable
  createDefault?: boolean | string | number; // При добавлении дефолтное значение. Если поле только для отображение (editable: false) то можно добавить дефолтное значение
}

export interface IBlockDetail extends IBlockIndentifier {
  fields: IField[];
}

export interface IBlockTreeDetail extends IBlockIndentifier {
  treePath: string;
}

export interface IEntityResponse {
  blocks: IBlock[];
  blockDetails: (IBlockDetail | IBlockTreeDetail)[];
  data: Record<string, any>;
}

export interface ICreateEntityResponse {
  id: string;
}
