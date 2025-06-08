import { ReleaseData, ReleaseStats } from './release'
import { BaseEntity } from './index'

// 공통 API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 에러 응답 타입
export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, any>
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 릴리즈 데이터 응답 타입
export interface ReleaseDataResponse extends ApiResponse<ReleaseData[]> {}

// 릴리즈 통계 응답 타입
export interface ReleaseStatsResponse extends ApiResponse<ReleaseStats> {}

// 대시보드 통계 타입
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

// 차트 데이터 타입
export interface ChartData {
  monthlyTrend: Array<{ month: string; count: number; year: number }>
  timeSlotDistribution: Array<{ timeSlot: string; count: number; percentage: number }>
  releaseTypeDistribution: Array<{ type: string; count: number; percentage: number }>
  repositoryComparison: Array<{ repository: string; count: number; percentage: number }>
}

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 요청 설정 타입
export interface RequestConfig {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}

export interface StatsResponse extends ApiResponse<DashboardStats> {}
export interface ChartDataResponse extends ApiResponse<ChartData> {}
