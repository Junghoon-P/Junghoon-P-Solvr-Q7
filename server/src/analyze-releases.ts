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
  week: number
  dayOfWeek: number
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
          week: this.getWeekNumber(publishedAt),
          dayOfWeek: publishedAt.getDay()
        }
      })
      .sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())
  }

  private generateStats(allReleases: ReleaseData[]): StatData[] {
    const stats: StatData[] = []

    // 전체 통계
    stats.push({ metric: 'total_releases', value: allReleases.length })

    // 리포지토리별 통계
    const byRepo = this.groupBy(allReleases, 'repo')
    Object.entries(byRepo).forEach(([repo, releases]) => {
      stats.push({
        metric: 'releases_by_repo',
        value: releases.length,
        repository: repo
      })
    })

    // 연도별 통계
    const byYear = this.groupBy(allReleases, 'year')
    Object.entries(byYear).forEach(([year, releases]) => {
      stats.push({
        metric: 'releases_by_year',
        value: releases.length,
        period: year
      })
    })

    // 월별 통계
    const byMonth = this.groupBy(allReleases, 'month')
    Object.entries(byMonth).forEach(([month, releases]) => {
      stats.push({
        metric: 'releases_by_month',
        value: releases.length,
        period: `month_${month}`
      })
    })

    // 요일별 통계
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const byDayOfWeek = this.groupBy(allReleases, 'dayOfWeek')
    Object.entries(byDayOfWeek).forEach(([day, releases]) => {
      stats.push({
        metric: 'releases_by_day_of_week',
        value: releases.length,
        period: dayNames[parseInt(day)]
      })
    })

    // 작성자별 통계
    const byAuthor = this.groupBy(allReleases, 'author')
    Object.entries(byAuthor).forEach(([author, releases]) => {
      stats.push({
        metric: 'releases_by_author',
        value: releases.length,
        repository: author
      })
    })

    // 프리릴리즈 통계
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
    headers: { id: string, title: string }[]
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

    // 릴리즈 상세 데이터 저장
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
        day_of_week: r.dayOfWeek
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
  }
}

// 스크립트 실행
if (require.main === module) {
  const analyzer = new ReleaseAnalyzer()
  analyzer.run().catch(console.error)
}
