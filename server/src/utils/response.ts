import { ApiResponse, PaginatedResponse } from '../types'

// 성공 응답 생성 함수
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

// 에러 응답 생성 함수
export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error
  }
}

// 페이지네이션 응답 생성 함수
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    success: true,
    data,
    total,
    page,
    limit,
    totalPages
  }
}

export default {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
}
