import { BaseEntity } from './index'

// 사용자 기본 타입
export interface User extends BaseEntity {
  username: string
  email: string
  displayName?: string
  avatar?: string
  role: UserRole
  isActive: boolean
  lastLoginAt?: string
}

// 사용자 역할 타입
export type UserRole = 'admin' | 'user' | 'viewer'

// 사용자 생성 요청 타입
export interface CreateUserRequest {
  username: string
  email: string
  displayName?: string
  role: UserRole
  password: string
}

// 사용자 업데이트 요청 타입
export interface UpdateUserRequest {
  username?: string
  email?: string
  displayName?: string
  role?: UserRole
  isActive?: boolean
}

// 사용자 로그인 요청 타입
export interface LoginRequest {
  username: string
  password: string
}

// 사용자 로그인 응답 타입
export interface LoginResponse {
  user: User
  token: string
  expiresIn: number
}
