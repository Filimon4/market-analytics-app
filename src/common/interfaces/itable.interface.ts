
export interface ITableColumn {
  code: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'link' | 'constants' | string;
  filtrable: boolean;
  linkUrl?: string;
  constantsData?: string[];
  path?: string;
}

export interface ITableListResponse<T> {
  columns: ITableColumn[],
  data: T[],
  page: number,
  total: number,
  maxPage: number
}
