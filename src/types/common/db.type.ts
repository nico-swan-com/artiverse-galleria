export type FindOptionsOrderValue =
  | 'ASC'
  | 'DESC'
  | { [key: string]: FindOptionsOrderValue }

export interface UpdateResult {
  raw: any
  affected?: number
  generatedMaps: any[]
}

export interface DeleteResult {
  raw: any
  affected?: number | null
}
