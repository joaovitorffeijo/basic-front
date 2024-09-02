export interface PageResponse<T> {
  status: number
  message: string
  result: PageResult<T>
}

export interface PageResult<T> {
  content: T
  totalElements: number
  totalPages: number
  last: boolean
  numberOfElements: number
  first: boolean
  number: number
}
