export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
} as const

export const API_ENDPOINTS = {
  USERS: '/users',
  HEALTH: '/health',
  RELEASES: {
    DATA: '/releases/data',
    STATS: '/releases/stats',
    CHARTS: '/releases/charts',
    REFRESH: '/releases/refresh'
  }
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const
