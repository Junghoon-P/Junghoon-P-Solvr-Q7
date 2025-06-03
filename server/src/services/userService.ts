// server/src/services/userService.ts
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { CreateUserDto, UpdateUserDto, User } from '../types'
import { Database } from '../types/database'

type UserServiceDeps = {
  db: Database
}

export const createUserService = ({ db }: UserServiceDeps) => {
  const getAllUsers = async (): Promise<User[]> => {
    return db.select().from(users)
  }

  const getUserById = async (id: number): Promise<User | undefined> => {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
    return result[0]
  }

  const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return result[0]
  }

  const createUser = async (userData: CreateUserDto): Promise<User> => {
    const now = new Date().toISOString()
    const newUser = {
      ...userData,
      createdAt: now,
      updatedAt: now
    }

    const result = await db.insert(users).values(newUser).returning()
    return result[0]
  }

  const updateUser = async (id: number, userData: UpdateUserDto): Promise<User | undefined> => {
    const now = new Date().toISOString()
    const updateData = {
      ...userData,
      updatedAt: now
    }

    const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning()

    return result[0]
  }

  const deleteUser = async (id: number): Promise<boolean> => {
    const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })
    return result.length > 0
  }

  return {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
  }
}

export type UserService = ReturnType<typeof createUserService>
