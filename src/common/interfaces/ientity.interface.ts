export interface IBlockIndentifier {
  blockCode: string
}

export interface IBlock {
  code: string,
  name: string,
  columnCapacity: number,
  maxColumns: number
}

export interface IField {
  title: string,
  editable: boolean,
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'select',
  path: string,
  editPath?: string
}

export interface IBlockDetail extends IBlockIndentifier {
  fields: IField[]
}

export interface IEntity {
  blocks: IBlock[]
  blockDetails: IBlockDetail[] 
  data: Record<string, any>
}