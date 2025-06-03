import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import env from '../config/env'
import * as schema from './schema'
import { Database as DrizzleDatabase } from '../types/database'

let db: DrizzleDatabase | null = null

export async function getDb(): Promise<DrizzleDatabase> {
  if (!db) {
    const sqlite = new Database(env.DATABASE_URL)
    db = drizzle(sqlite, { schema }) as DrizzleDatabase
  }
  return db
}

export async function initializeDatabase(): Promise<DrizzleDatabase> {
  return getDb()
}

export default { initializeDatabase, getDb }
