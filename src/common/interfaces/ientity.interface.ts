export interface IBlock {
  type: string,
  name: string,
  columnCapacity: number
}

export interface IEntity {
  blocks: IBlock[]
  data: Array<{blockType: string} & object>
}