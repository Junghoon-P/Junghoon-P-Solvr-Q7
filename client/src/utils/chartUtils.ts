// 차트 색상 팔레트
export const CHART_COLORS = {
  PRIMARY: '#8884d8',
  SECONDARY: '#82ca9d',
  ACCENT: '#ffc658',
  WARNING: '#ff7300',
  DANGER: '#ff0000',
  PIE_COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
} as const

// 차트 설정
export const CHART_CONFIG = {
  HEIGHT: 300,
  MARGIN: { top: 20, right: 30, left: 20, bottom: 5 },
  AXIS: {
    FONT_SIZE: 12,
    ANGLE: -45,
    HEIGHT: 80
  }
} as const

// 시간대 순서
export const TIME_SLOT_ORDER = [
  'EARLY MORNING',
  'MORNING',
  'WORK MORNING',
  'LUNCH TIME',
  'WORK AFTERNOON',
  'EVENING',
  'NIGHT'
] as const

// 시간대 포맷팅
export const formatTimeSlot = (timeSlot: string): string => timeSlot.replace('_', ' ').toUpperCase()

// 시간대별 정렬
export const sortByTimeSlot = <T extends { name: string }>(data: T[]): T[] => {
  return [...data].sort(
    (a, b) => TIME_SLOT_ORDER.indexOf(a.name as any) - TIME_SLOT_ORDER.indexOf(b.name as any)
  )
}

// 툴팁 포맷터들
export const tooltipFormatters = {
  count: (value: number) => [`${value}개`, '수량'],
  percentage: (value: number) => [`${value}%`, '비율'],
  countAndPercent: (value: number, name: string) => [
    name === 'count' ? `${value}개` : `${value}%`,
    name === 'count' ? '릴리즈 수' : '비율'
  ],
  releases: (value: number, name: string) => [
    name === 'releases' ? `${value}개` : `${value}%`,
    name === 'releases' ? '릴리즈 수' : '비율'
  ]
} as const
