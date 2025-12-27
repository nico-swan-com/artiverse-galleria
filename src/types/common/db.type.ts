export type FindOptionsOrderValue =
  | 'ASC'
  | 'DESC'
  | { [key: string]: FindOptionsOrderValue }

export interface UpdateResult {
  raw: unknown
  affected?: number
  generatedMaps: unknown[]
}

export interface DeleteResult {
  raw: unknown
  affected?: number | null
}
