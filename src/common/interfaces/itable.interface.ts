export interface ITableColumn {
  code: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'constants' | 'datetime';
  filtrable: boolean;
  selectUrl?: string; // for select
  constantList?: string[]; // for constant
  /**
   * Отображение
   *
   * Перекрывает code для получения пути значение в обхекте. Используется при вложенных объектах
   */
  path?: string;
  /**
   * Фильтрафия
   *
   * Вид фильтра datetime типа
   */
  dateTimeFilterType?: 'period' | 'exact';
}

export interface ITableListResponse<T> {
  columns: ITableColumn[];
  data: T[];
  page: number;
  total: number;
  maxPage: number;
}

export interface IListEntityTableListResponse<T> {
  data: T[];
  page: number;
  total: number;
  maxPage: number;
}

export interface ITableColumnFilterDatetimePeriod {
  from: string;
  to: string;
}
