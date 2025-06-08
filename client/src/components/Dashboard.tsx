import { memo, useMemo } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import { ReleasesByTimeSlot } from './charts/ReleasesByTimeSlot'
import { ReleaseTrendByMonth } from './charts/ReleaseTrendByMonth'
import { ReleaseTypeDistribution } from './charts/ReleaseTypeDistribution'
import { RepositoryComparison } from './charts/RepositoryComparison'
import { LoadingSpinner, ErrorMessage } from './common'
import { MESSAGES } from '../constants'

export const Dashboard = memo(() => {
  const { stats, chartData, loading, error, refresh } = useDashboardData()

  // 퍼센티지 계산을 useMemo로 최적화
  const percentages = useMemo(() => {
    if (!stats) return null

    return {
      weekday: ((stats.weekdayReleases / stats.totalReleases) * 100).toFixed(1),
      prerelease: ((stats.prereleases / stats.totalReleases) * 100).toFixed(1),
      hotfix: ((stats.hotfixes / stats.totalReleases) * 100).toFixed(1)
    }
  }, [stats])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingSpinner message={MESSAGES.LOADING.DASHBOARD} className="min-h-screen" />
      </div>
    )
  }

  if (error || !stats || !chartData || !percentages) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorMessage
          title="데이터 로딩 오류"
          message={error || MESSAGES.ERROR.DATA_FETCH_FAILED}
          onRetry={refresh}
          className="bg-white shadow-lg"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🚀 당근마켓 릴리즈 분석 대시보드</h1>
              <p className="mt-2 text-gray-600">
                daangn/stackflow와 daangn/seed-design 리포지토리의 릴리즈 패턴 분석
              </p>
            </div>
            <button
              onClick={refresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">총 릴리즈</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalReleases}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">평일 릴리즈</h3>
            <p className="text-3xl font-bold text-green-600">{stats.weekdayReleases}</p>
            <p className="text-sm text-gray-500">({percentages.weekday}%)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">프리릴리즈</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.prereleases}</p>
            <p className="text-sm text-gray-500">({percentages.prerelease}%)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">핫픽스</h3>
            <p className="text-3xl font-bold text-red-600">{stats.hotfixes}</p>
            <p className="text-sm text-gray-500">({percentages.hotfix}%)</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReleaseTrendByMonth data={chartData.monthlyTrend} />
          <ReleasesByTimeSlot data={chartData.timeSlotDistribution} />
          <ReleaseTypeDistribution data={chartData.releaseTypeDistribution} />
          <RepositoryComparison data={chartData.repositoryComparison} />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>데이터 소스: GitHub API • 마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
        </footer>
      </div>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'
