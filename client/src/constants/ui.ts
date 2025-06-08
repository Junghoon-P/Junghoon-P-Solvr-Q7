export const UI_CONFIG = {
  LOADING_SPINNER: {
    SIZES: {
      SM: 'sm',
      MD: 'md',
      LG: 'lg'
    } as const,
    SIZE_CLASSES: {
      sm: 'h-8 w-8',
      md: 'h-32 w-32',
      lg: 'h-48 w-48'
    } as const
  },
  ERROR_VARIANTS: {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  } as const,
  ERROR_VARIANT_CLASSES: {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  } as const
} as const

export const MESSAGES = {
  LOADING: {
    DEFAULT: '로딩 중...',
    DASHBOARD: '대시보드 데이터를 불러오는 중...',
    USER_LIST: '사용자 목록을 불러오는 중...'
  },
  ERROR: {
    DEFAULT: '오류가 발생했습니다.',
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    DATA_FETCH_FAILED: '데이터를 불러오는데 실패했습니다.',
    REFRESH_FAILED: '데이터 새로고침에 실패했습니다.',
    API_ERROR: 'API 요청이 실패했습니다.'
  },
  CONFIRM: {
    DELETE_USER: '사용자를 삭제하시겠습니까?'
  }
} as const
