export interface IBlockIndentifier {
  blockCode: string
}

export interface IBlock {
  code: string,
  name: string,
  columnCapacity: number,
  maxColumns: number,
  blockType: "table" | "tree"
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

export interface IBlockTreeDetail extends IBlockIndentifier {
  treePath: string
}

export interface IEntity {
  blocks: IBlock[]
  blockDetails: (IBlockDetail | IBlockTreeDetail)[]
  data: Record<string, any>
}