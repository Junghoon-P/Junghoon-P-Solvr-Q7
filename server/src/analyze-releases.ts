import axios from 'axios'
import * as csvWriter from 'csv-writer'
import * as fs from 'fs'
import * as path from 'path'

interface GitHubRelease {
  tag_name: string
  name: string
  published_at: string
  author: {
    login: string
  }
  prerelease: boolean
  draft: boolean
}

interface ReleaseData {
  repo: string
  tagName: string
  name: string
  publishedAt: Date
  author: string
  isPrerelease: boolean
  isDraft: boolean
  year: number
  month: number
  quarter: number
  week: number
  dayOfWeek: number
  hour: number
  timeSlot: string
  isWeekend: boolean
  versionType: string
  releaseType: string
  isMajorVersion: boolean
  isPatchVersion: boolean
  isHotfix: boolean
  daysSinceEpoch: number
  monthName: string
  dayName: string
  seasonQuarter: string
}

interface StatData {
  metric: string
  value: number
  repository?: string
  period?: string
}

class ReleaseAnalyzer {
  private repos = ['daangn/stackflow', 'daangn/seed-design']

  async fetchReleases(repo: string): Promise<GitHubRelease[]> {
    console.log(`Fetching releases for ${repo}...`)
    const releases: GitHubRelease[] = []
    let page = 1

    while (true) {
      try {
        const response = await axios.get(`https://api.github.com/repos/${repo}/releases`, {
          params: { page, per_page: 100 },
          headers: {
            'User-Agent': 'Release-Analyzer'
          }
        })

        if (response.data.length === 0) break
        releases.push(...response.data)
        page++
      } catch (error) {
        console.error(`Error fetching releases for ${repo}:`, error)
        break
      }
    }

    return releases
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  private processReleases(releases: GitHubRelease[], repo: string): ReleaseData[] {
    return releases
      .filter(release => !release.draft)
      .map(release => {
        const publishedAt = new Date(release.published_at)
        const dayOfWeek = publishedAt.getDay()
        const hour = publishedAt.getHours()

        return {
          repo,
          tagName: release.tag_name,
          name: release.name || release.tag_name,
          publishedAt,
          author: release.author.login,
          isPrerelease: release.prerelease,
          isDraft: release.draft,
          year: publishedAt.getFullYear(),
          month: publishedAt.getMonth() + 1,
          quarter: Math.ceil((publishedAt.getMonth() + 1) / 3),
          week: this.getWeekNumber(publishedAt),
          dayOfWeek,
          hour,
          timeSlot: this.getTimeSlot(hour),
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
          versionType: this.getVersionType(release.tag_name),
          releaseType: this.getReleaseType(release.tag_name, release.prerelease),
          isMajorVersion: this.isMajorVersion(release.tag_name),
          isPatchVersion: this.isPatchVersion(release.tag_name),
          isHotfix: this.isHotfix(release.tag_name),
          daysSinceEpoch: Math.floor(publishedAt.getTime() / (1000 * 60 * 60 * 24)),
          monthName: publishedAt.toLocaleString('en-US', { month: 'long' }),
          dayName: publishedAt.toLocaleString('en-US', { weekday: 'long' }),
          seasonQuarter: this.getSeasonQuarter(publishedAt.getMonth() + 1)
        }
      })
      .sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())
  }

  private getTimeSlot(hour: number): string {
    if (hour < 6) return 'early_morning'
    if (hour < 9) return 'morning'
    if (hour < 12) return 'work_morning'
    if (hour < 14) return 'lunch_time'
    if (hour < 18) return 'work_afternoon'
    if (hour < 21) return 'evening'
    return 'night'
  }

  private getVersionType(tagName: string): string {
    if (/v?\d+\.\d+\.\d+/.test(tagName)) return 'semantic'
    if (/v?\d+\.\d+/.test(tagName)) return 'major_minor'
    if (/v?\d+/.test(tagName)) return 'major_only'
    return 'custom'
  }

  private getReleaseType(tagName: string, isPrerelease: boolean): string {
    if (isPrerelease) {
      if (tagName.includes('alpha')) return 'alpha'
      if (tagName.includes('beta')) return 'beta'
      if (tagName.includes('rc')) return 'release_candidate'
      return 'prerelease'
    }
    return 'stable'
  }

  private isMajorVersion(tagName: string): boolean {
    const match = tagName.match(/v?(\d+)\.(\d+)\.(\d+)/)
    if (!match) return false
    const [, major, minor, patch] = match
    return minor === '0' && patch === '0'
  }

  private isPatchVersion(tagName: string): boolean {
    const match = tagName.match(/v?(\d+)\.(\d+)\.(\d+)/)
    if (!match) return false
    const [, , minor, patch] = match
    return patch !== '0'
  }

  private isHotfix(tagName: string): boolean {
    return (
      /hotfix|fix|patch/i.test(tagName) || (tagName.includes('.') && tagName.split('.').length > 3)
    )
  }

  private getSeasonQuarter(month: number): string {
    const seasons = {
      1: 'Q1_Winter',
      2: 'Q1_Winter',
      3: 'Q1_Spring',
      4: 'Q2_Spring',
      5: 'Q2_Spring',
      6: 'Q2_Summer',
      7: 'Q3_Summer',
      8: 'Q3_Summer',
      9: 'Q3_Fall',
      10: 'Q4_Fall',
      11: 'Q4_Fall',
      12: 'Q4_Winter'
    }
    return seasons[month as keyof typeof seasons] || 'Q1_Winter'
  }

  private generateStats(allReleases: ReleaseData[]): StatData[] {
    const stats: StatData[] = []

    // 주말 제외 릴리즈 필터링
    const weekdayReleases = allReleases.filter(r => !r.isWeekend)

    // 전체 통계
    stats.push({ metric: 'total_releases', value: allReleases.length })
    stats.push({ metric: 'total_weekday_releases', value: weekdayReleases.length })
    stats.push({
      metric: 'total_weekend_releases',
      value: allReleases.length - weekdayReleases.length
    })

    // 리포지토리별 통계
    const byRepo = this.groupBy(allReleases, 'repo')
    Object.entries(byRepo).forEach(([repo, releases]) => {
      const weekdayCount = releases.filter(r => !r.isWeekend).length
      stats.push({
        metric: 'releases_by_repo',
        value: releases.length,
        repository: repo
      })
      stats.push({
        metric: 'weekday_releases_by_repo',
        value: weekdayCount,
        repository: repo
      })
    })

    // 연도별 통계 (주말 제외)
    const byYear = this.groupBy(weekdayReleases, 'year')
    Object.entries(byYear).forEach(([year, releases]) => {
      stats.push({
        metric: 'weekday_releases_by_year',
        value: releases.length,
        period: year
      })
    })

    // 월별 통계 (주말 제외)
    const byMonth = this.groupBy(weekdayReleases, 'month')
    Object.entries(byMonth).forEach(([month, releases]) => {
      stats.push({
        metric: 'weekday_releases_by_month',
        value: releases.length,
        period: `month_${month}`
      })
    })

    // 요일별 통계 (기존 유지)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const byDayOfWeek = this.groupBy(allReleases, 'dayOfWeek')
    Object.entries(byDayOfWeek).forEach(([day, releases]) => {
      stats.push({
        metric: 'releases_by_day_of_week',
        value: releases.length,
        period: dayNames[parseInt(day)]
      })
    })

    // 평일별 통계 (월-금만)
    const weekdaysByDay = this.groupBy(weekdayReleases, 'dayOfWeek')
    Object.entries(weekdaysByDay).forEach(([day, releases]) => {
      stats.push({
        metric: 'weekday_only_releases_by_day',
        value: releases.length,
        period: dayNames[parseInt(day)]
      })
    })

    // 작성자별 통계 (주말 제외)
    const byAuthor = this.groupBy(weekdayReleases, 'author')
    Object.entries(byAuthor).forEach(([author, releases]) => {
      stats.push({
        metric: 'weekday_releases_by_author',
        value: releases.length,
        repository: author
      })
    })

    // 프리릴리즈 통계 (주말 제외)
    const weekdayPrereleases = weekdayReleases.filter(r => r.isPrerelease)
    stats.push({ metric: 'weekday_prerelease_count', value: weekdayPrereleases.length })
    stats.push({
      metric: 'weekday_stable_release_count',
      value: weekdayReleases.length - weekdayPrereleases.length
    })

    // 전체 프리릴리즈 통계 (기존 유지)
    const prereleases = allReleases.filter(r => r.isPrerelease)
    stats.push({ metric: 'prerelease_count', value: prereleases.length })
    stats.push({ metric: 'stable_release_count', value: allReleases.length - prereleases.length })

    return stats
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (groups, item) => {
        const group = String(item[key])
        groups[group] = groups[group] || []
        groups[group].push(item)
        return groups
      },
      {} as Record<string, T[]>
    )
  }

  async saveToCSV(
    data: any[],
    filename: string,
    headers: { id: string; title: string }[]
  ): Promise<void> {
    const outputDir = path.join(__dirname, '..', 'output')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const filePath = path.join(outputDir, filename)
    const writer = csvWriter.createObjectCsvWriter({
      path: filePath,
      header: headers
    })

    await writer.writeRecords(data)
    console.log(`✅ ${filename} saved to ${filePath}`)
  }

  async run(): Promise<void> {
    console.log('🚀 릴리즈 데이터 분석 시작...')

    const allReleaseData: ReleaseData[] = []

    for (const repo of this.repos) {
      const releases = await this.fetchReleases(repo)
      const processedReleases = this.processReleases(releases, repo)
      allReleaseData.push(...processedReleases)
      console.log(`📦 ${repo}: ${releases.length}개 릴리즈 발견`)
    }

    // 주말 제외 릴리즈 데이터 필터링
    const weekdayReleases = allReleaseData.filter(r => !r.isWeekend)
    console.log(
      `📊 전체 릴리즈: ${allReleaseData.length}개, 평일 릴리즈: ${weekdayReleases.length}개`
    )

    // 릴리즈 상세 데이터 저장 (대시보드용 확장 컬럼 포함)
    await this.saveToCSV(
      allReleaseData.map(r => ({
        repository: r.repo,
        tag_name: r.tagName,
        release_name: r.name,
        published_at: r.publishedAt.toISOString(),
        published_date: r.publishedAt.toISOString().split('T')[0],
        published_time: r.publishedAt.toISOString().split('T')[1].split('.')[0],
        author: r.author,
        is_prerelease: r.isPrerelease,
        year: r.year,
        month: r.month,
        quarter: r.quarter,
        month_name: r.monthName,
        week_number: r.week,
        day_of_week: r.dayOfWeek,
        day_name: r.dayName,
        hour: r.hour,
        time_slot: r.timeSlot,
        is_weekend: r.isWeekend,
        season_quarter: r.seasonQuarter,
        version_type: r.versionType,
        release_type: r.releaseType,
        is_major_version: r.isMajorVersion,
        is_patch_version: r.isPatchVersion,
        is_hotfix: r.isHotfix,
        days_since_epoch: r.daysSinceEpoch
      })),
      'enhanced_release_details.csv',
      [
        { id: 'repository', title: 'Repository' },
        { id: 'tag_name', title: 'Tag Name' },
        { id: 'release_name', title: 'Release Name' },
        { id: 'published_at', title: 'Published At (ISO)' },
        { id: 'published_date', title: 'Published Date' },
        { id: 'published_time', title: 'Published Time' },
        { id: 'author', title: 'Author' },
        { id: 'is_prerelease', title: 'Is Prerelease' },
        { id: 'year', title: 'Year' },
        { id: 'month', title: 'Month' },
        { id: 'quarter', title: 'Quarter' },
        { id: 'month_name', title: 'Month Name' },
        { id: 'week_number', title: 'Week Number' },
        { id: 'day_of_week', title: 'Day of Week (0=Sun)' },
        { id: 'day_name', title: 'Day Name' },
        { id: 'hour', title: 'Hour (0-23)' },
        { id: 'time_slot', title: 'Time Slot' },
        { id: 'is_weekend', title: 'Is Weekend' },
        { id: 'season_quarter', title: 'Season Quarter' },
        { id: 'version_type', title: 'Version Type' },
        { id: 'release_type', title: 'Release Type' },
        { id: 'is_major_version', title: 'Is Major Version' },
        { id: 'is_patch_version', title: 'Is Patch Version' },
        { id: 'is_hotfix', title: 'Is Hotfix' },
        { id: 'days_since_epoch', title: 'Days Since Epoch' }
      ]
    )

    // 기존 릴리즈 상세 데이터 저장 (하위 호환성)
    await this.saveToCSV(
      allReleaseData.map(r => ({
        repository: r.repo,
        tag_name: r.tagName,
        release_name: r.name,
        published_at: r.publishedAt.toISOString(),
        author: r.author,
        is_prerelease: r.isPrerelease,
        year: r.year,
        month: r.month,
        week_number: r.week,
        day_of_week: r.dayOfWeek,
        is_weekend: r.isWeekend
      })),
      'release_details.csv',
      [
        { id: 'repository', title: 'Repository' },
        { id: 'tag_name', title: 'Tag Name' },
        { id: 'release_name', title: 'Release Name' },
        { id: 'published_at', title: 'Published At' },
        { id: 'author', title: 'Author' },
        { id: 'is_prerelease', title: 'Is Prerelease' },
        { id: 'year', title: 'Year' },
        { id: 'month', title: 'Month' },
        { id: 'week_number', title: 'Week Number' },
        { id: 'day_of_week', title: 'Day of Week' },
        { id: 'is_weekend', title: 'Is Weekend' }
      ]
    )

    // 평일만 릴리즈 상세 데이터 저장
    await this.saveToCSV(
      weekdayReleases.map(r => ({
        repository: r.repo,
        tag_name: r.tagName,
        release_name: r.name,
        published_at: r.publishedAt.toISOString(),
        author: r.author,
        is_prerelease: r.isPrerelease,
        year: r.year,
        month: r.month,
        week_number: r.week,
        day_of_week: r.dayOfWeek
      })),
      'weekday_release_details.csv',
      [
        { id: 'repository', title: 'Repository' },
        { id: 'tag_name', title: 'Tag Name' },
        { id: 'release_name', title: 'Release Name' },
        { id: 'published_at', title: 'Published At' },
        { id: 'author', title: 'Author' },
        { id: 'is_prerelease', title: 'Is Prerelease' },
        { id: 'year', title: 'Year' },
        { id: 'month', title: 'Month' },
        { id: 'week_number', title: 'Week Number' },
        { id: 'day_of_week', title: 'Day of Week' }
      ]
    )

    // 통계 데이터 생성 및 저장
    const stats = this.generateStats(allReleaseData)
    await this.saveToCSV(stats, 'release_statistics.csv', [
      { id: 'metric', title: 'Metric' },
      { id: 'value', title: 'Value' },
      { id: 'repository', title: 'Repository/Author' },
      { id: 'period', title: 'Period' }
    ])

    console.log('✨ 분석 완료! output 폴더를 확인하세요.')
    console.log(`📊 총 ${allReleaseData.length}개의 릴리즈를 분석했습니다.`)
    console.log(
      `📈 평일 릴리즈 비율: ${((weekdayReleases.length / allReleaseData.length) * 100).toFixed(1)}%`
    )
  }
}

// 스크립트 실행
if (require.main === module) {
  const analyzer = new ReleaseAnalyzer()
  analyzer.run().catch(console.error)
}
