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

export interface ChartData {
  name: string
  value?: number
  [key: string]: any
}

// 릴리즈 통계 타입
export interface ReleaseStats {
  totalReleases: number
  weekdayReleases: number
  weekendReleases: number
  prereleases: number
  hotfixes: number
  byRepository: {
    [key: string]: {
      total: number
      prereleases: number
      hotfixes: number
    }
  }
  byTimeSlot: {
    [key: string]: number
  }
  byMonth: {
    [key: string]: {
      total: number
      weekday: number
      weekend: number
    }
  }
}
