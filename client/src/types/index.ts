// 기본 타입들
export * from './api'
export * from './release'
export * from './user'

// 공통 타입들
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

export interface PaginationOptions {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface FilterOptions {
  search?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  type?: string
}
