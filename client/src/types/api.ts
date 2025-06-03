// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
}

// 릴리즈 데이터 응답 타입
export interface ReleaseDataResponse extends ApiResponse<ReleaseData[]> {}

// 릴리즈 통계 응답 타입
export interface ReleaseStatsResponse extends ApiResponse<ReleaseStats> {}
