export interface ITableColumn {
  code: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'constants'; // TODO: Добавить datetime
  filtrable: boolean;
  selectUrl?: string; // for select
  constantList?: string[]; // for constant
  path?: string;
}

export interface ITableListResponse<T> {
  columns: ITableColumn[];
  data: T[];
  page: number;
  total: number;
  maxPage: number;
}
