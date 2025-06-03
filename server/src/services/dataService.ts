import * as fs from 'fs'
import * as path from 'path'
import Papa from 'papaparse'

export interface ReleaseData {
  Repository: string
  'Tag Name': string
  'Release Name': string
  'Published At (ISO)': string
  'Published Date': string
  'Published Time': string
  Author: string
  'Is Prerelease': boolean
  Year: number
  Month: number
  Quarter: number
  'Month Name': string
  'Week Number': number
  'Day of Week (0=Sun)': number
  'Day Name': string
  'Hour (0-23)': number
  'Time Slot': string
  'Is Weekend': boolean
  'Season Quarter': string
  'Version Type': string
  'Release Type': string
  'Is Major Version': boolean
  'Is Patch Version': boolean
  'Is Hotfix': boolean
  'Days Since Epoch': number
}

export interface DashboardStats {
  totalReleases: number
  weekdayReleases: number
  prereleases: number
  hotfixes: number
  byRepository: Record<string, number>
  byTimeSlot: Record<string, number>
  byMonth: Record<string, number>
  byReleaseType: Record<string, number>
}

export class DataService {
  private releaseData: ReleaseData[] = []
  private stats: DashboardStats | null = null
  private isLoaded = false

  async initialize(): Promise<void> {
    if (this.isLoaded) return

    try {
      await this.loadRawData()
      this.processData()
      this.isLoaded = true
      console.log(`✅ 데이터 서비스 초기화 완료: ${this.releaseData.length}개 릴리즈 로드됨`)
    } catch (error) {
      console.error('❌ 데이터 서비스 초기화 실패:', error)
      throw error
    }
  }

  private async loadRawData(): Promise<void> {
    const csvPath = path.join(process.cwd(), 'output', 'enhanced_release_details.csv')

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV 파일을 찾을 수 없습니다: ${csvPath}`)
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const parseResult = Papa.parse<ReleaseData>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        // Boolean 필드 변환
        const booleanFields = [
          'Is Prerelease',
          'Is Weekend',
          'Is Major Version',
          'Is Patch Version',
          'Is Hotfix'
        ]

        if (booleanFields.includes(field as string)) {
          if (typeof value === 'string') {
            return value.toLowerCase() === 'true'
          }
          return Boolean(value)
        }
        return value
      }
    })

    if (parseResult.errors.length > 0) {
      console.warn('CSV 파싱 경고:', parseResult.errors)
    }

    this.releaseData = parseResult.data
  }

  private processData(): void {
    const data = this.releaseData

    // 기본 통계 계산
    const totalReleases = data.length
    const weekdayReleases = data.filter(r => !r['Is Weekend']).length
    const prereleases = data.filter(r => r['Is Prerelease']).length
    const hotfixes = data.filter(r => r['Is Hotfix']).length

    // 레포지토리별 통계
    const byRepository: Record<string, number> = {}
    data.forEach(r => {
      byRepository[r.Repository] = (byRepository[r.Repository] || 0) + 1
    })

    // 시간대별 통계
    const byTimeSlot: Record<string, number> = {}
    data.forEach(r => {
      byTimeSlot[r['Time Slot']] = (byTimeSlot[r['Time Slot']] || 0) + 1
    })

    // 월별 통계
    const byMonth: Record<string, number> = {}
    data.forEach(r => {
      byMonth[r['Month Name']] = (byMonth[r['Month Name']] || 0) + 1
    })

    // 릴리즈 타입별 통계
    const byReleaseType: Record<string, number> = {}
    data.forEach(r => {
      byReleaseType[r['Release Type']] = (byReleaseType[r['Release Type']] || 0) + 1
    })

    this.stats = {
      totalReleases,
      weekdayReleases,
      prereleases,
      hotfixes,
      byRepository,
      byTimeSlot,
      byMonth,
      byReleaseType
    }
  }

  // 전체 릴리즈 데이터 반환
  getAllReleases(): ReleaseData[] {
    if (!this.isLoaded) {
      throw new Error('데이터 서비스가 초기화되지 않았습니다')
    }
    return this.releaseData
  }

  // 가공된 통계 데이터 반환
  getStats(): DashboardStats {
    if (!this.isLoaded || !this.stats) {
      throw new Error('데이터 서비스가 초기화되지 않았습니다')
    }
    return this.stats
  }

  // 필터링된 데이터 반환
  getFilteredReleases(options: {
    repository?: string
    dateFrom?: string
    dateTo?: string
    isPrerelease?: boolean
    timeSlot?: string
  }): ReleaseData[] {
    if (!this.isLoaded) {
      throw new Error('데이터 서비스가 초기화되지 않았습니다')
    }

    let filtered = this.releaseData

    if (options.repository) {
      filtered = filtered.filter(r => r.Repository === options.repository)
    }

    if (options.dateFrom) {
      filtered = filtered.filter(r => r['Published Date'] >= options.dateFrom!)
    }

    if (options.dateTo) {
      filtered = filtered.filter(r => r['Published Date'] <= options.dateTo!)
    }

    if (options.isPrerelease !== undefined) {
      filtered = filtered.filter(r => r['Is Prerelease'] === options.isPrerelease)
    }

    if (options.timeSlot) {
      filtered = filtered.filter(r => r['Time Slot'] === options.timeSlot)
    }

    return filtered
  }

  // 데이터 새로고침
  async refresh(): Promise<void> {
    this.isLoaded = false
    this.releaseData = []
    this.stats = null
    await this.initialize()
  }
}

// 싱글톤 인스턴스
export const dataService = new DataService()
