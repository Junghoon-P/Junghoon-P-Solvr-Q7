export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface CreateUserDto {
  name: string
  email: string
  role: UserRole
}

export interface UpdateUserDto {
  name?: string
  email?: string
  role?: UserRole
}
