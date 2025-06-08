import { ReleaseData, ReleaseStats } from './release'

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

export interface DashboardStats {
  totalReleases: number
  weekdayReleases: number
  prereleases: number
  hotfixes: number
  byRepository: Record<string, number>
  byTimeSlot: Record<string, number>
  byMonth: Record<string, number>
  byReleaseType: Record<string, number>
}

export interface ChartData {
  monthlyTrend: Array<{ month: string; count: number; year: number }>
  timeSlotDistribution: Array<{ timeSlot: string; count: number; percentage: number }>
  releaseTypeDistribution: Array<{ type: string; count: number; percentage: number }>
  repositoryComparison: Array<{ repository: string; count: number; percentage: number }>
}

export interface StatsResponse extends ApiResponse<DashboardStats> {}
export interface ChartDataResponse extends ApiResponse<ChartData> {}
