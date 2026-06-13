// #region Actions
export interface IActionButton {
  title: string;
  code: string;
  size: 'small' | 'medium' | 'large';
}

export interface IActionLogicButton extends IActionButton {
  type: 'logic';
}

export interface IActionDirectButton extends IActionButton {
  type: 'directRequest';
  requestUrl: string;
}

export type IBlockAction = IActionLogicButton | IActionDirectButton;
// #endregion

// #region Blocks
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
  tableColumns: {
    key: string;
    title: string;
    path: string;
  }[];
  entityActions?: IBlockAction[];
  metricUrls: {
    tableUrl: string; // Список объектов
  };
  baseEntityUrl: string;
}

export interface IBlock {
  code: string;
  name: string;
  actions?: IBlockAction[];
  /**
   * Добавление
   *
   * При добавлениии блок будет скрыт
   */
  createHide?: true;
}

export type TEntityBlock = ITreeBlock | ITableBlock | IAnalyticBlock | IMetricBlock;
// #endregion

// #region Block Details

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

export interface IBlockIndentifier {
  blockCode: string;
}

export interface ITableBlockDetail extends IBlockIndentifier {
  fields: IField[];
}

export interface ITreeBlockDetail extends IBlockIndentifier {
  treePath: string;
}

export interface IMetricsBlockDetail extends IBlockIndentifier {
  fields: IField[];
}

export type TEntityBlockDetail = (ITableBlockDetail | ITreeBlockDetail | IMetricsBlockDetail)[];

// #endregion

export interface IEntityResponse<B = Record<string, any>> {
  blocks: TEntityBlock[];
  blockDetails: TEntityBlockDetail;
  data: B;
}

export interface ICreateEntityResponse {
  id: string;
}
