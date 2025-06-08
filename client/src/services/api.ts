import axios, { AxiosInstance, AxiosError } from 'axios'
import { User, CreateUserDto, UpdateUserDto } from '../types/user'
import { API_CONFIG, API_ENDPOINTS, MESSAGES } from '../constants'

// API 응답 타입
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// API 에러 처리 유틸리티
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || MESSAGES.ERROR.NETWORK
  }
  return error instanceof Error ? error.message : MESSAGES.ERROR.DEFAULT
}

// Axios 인스턴스 생성
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 요청 인터셉터
  client.interceptors.request.use(
    config => {
      console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    },
    error => Promise.reject(error)
  )

  // 응답 인터셉터
  client.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      console.error('API 에러:', error.response?.status, error.message)
      return Promise.reject(error)
    }
  )

  return client
}

const api = createApiClient()

// 사용자 서비스
export const userService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS)
      return response.data.data || []
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  getById: async (id: number): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`)
      if (!response.data.data) {
        throw new Error('사용자를 찾을 수 없습니다.')
      }
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  create: async (userData: CreateUserDto): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>(API_ENDPOINTS.USERS, userData)
      if (!response.data.data) {
        throw new Error('사용자 생성에 실패했습니다.')
      }
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  update: async (id: number, userData: UpdateUserDto): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`, userData)
      if (!response.data.data) {
        throw new Error('사용자 정보 수정에 실패했습니다.')
      }
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`${API_ENDPOINTS.USERS}/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

// 헬스체크 서비스
export const healthService = {
  check: async (): Promise<{ status: string }> => {
    try {
      const response = await api.get<ApiResponse<{ status: string }>>(API_ENDPOINTS.HEALTH)
      return response.data.data || { status: 'unknown' }
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

// 릴리즈 데이터 서비스
export const releaseService = {
  getData: async <T>(): Promise<T> => {
    try {
      const response = await api.get<ApiResponse<T>>(API_ENDPOINTS.RELEASES.DATA)
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || MESSAGES.ERROR.API_FAILED)
      }
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  getStats: async <T>(): Promise<T> => {
    try {
      const response = await api.get<ApiResponse<T>>(API_ENDPOINTS.RELEASES.STATS)
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || MESSAGES.ERROR.API_FAILED)
      }
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  getCharts: async <T>(): Promise<T> => {
    try {
      const response = await api.get<ApiResponse<T>>(API_ENDPOINTS.RELEASES.CHARTS)
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || MESSAGES.ERROR.API_FAILED)
      }
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  refresh: async (): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.RELEASES.REFRESH)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export default api
