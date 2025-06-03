// 기본 차트 데이터 인터페이스
export interface BaseChartData {
  count: number
  percentage: number
}

// 월별 트렌드 데이터
export interface MonthlyTrendData {
  month: string
  count: number
  year: number
}

// 시간대별 데이터
export interface TimeSlotData extends BaseChartData {
  timeSlot: string
}

// 릴리즈 타입별 데이터
export interface ReleaseTypeData extends BaseChartData {
  type: string
}

// 저장소별 데이터
export interface RepositoryData extends BaseChartData {
  repository: string
}

// 차트 Props 타입들
export interface MonthlyTrendProps {
  data: MonthlyTrendData[]
}

export interface TimeSlotProps {
  data: TimeSlotData[]
}

export interface ReleaseTypeProps {
  data: ReleaseTypeData[]
}

export interface RepositoryProps {
  data: RepositoryData[]
}
