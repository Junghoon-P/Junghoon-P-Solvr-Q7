import axios from 'axios'
import { User, CreateUserDto, UpdateUserDto } from '../types/user'

// API 응답 타입
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users')
    return response.data.data || []
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`)
    if (!response.data.data) {
      throw new Error('사용자를 찾을 수 없습니다.')
    }
    return response.data.data
  },

  create: async (userData: CreateUserDto): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', userData)
    if (!response.data.data) {
      throw new Error('사용자 생성에 실패했습니다.')
    }
    return response.data.data
  },

  update: async (id: number, userData: UpdateUserDto): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData)
    if (!response.data.data) {
      throw new Error('사용자 정보 수정에 실패했습니다.')
    }
    return response.data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`)
  }
}

export const healthService = {
  check: async (): Promise<{ status: string }> => {
    const response = await api.get<ApiResponse<{ status: string }>>('/health')
    return response.data.data || { status: 'unknown' }
  }
}

export default api
