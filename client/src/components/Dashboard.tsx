import { memo, useMemo, Suspense, lazy } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import { LoadingSpinner, ErrorMessage } from './common'
import { MESSAGES } from '../constants'

// 차트 컴포넌트들을 lazy loading으로 변경
const ReleasesByTimeSlot = lazy(() =>
  import('./charts/ReleasesByTimeSlot').then(module => ({ default: module.ReleasesByTimeSlot }))
)
const ReleaseTrendByMonth = lazy(() =>
  import('./charts/ReleaseTrendByMonth').then(module => ({ default: module.ReleaseTrendByMonth }))
)
const ReleaseTypeDistribution = lazy(() =>
  import('./charts/ReleaseTypeDistribution').then(module => ({
    default: module.ReleaseTypeDistribution
  }))
)
const RepositoryComparison = lazy(() =>
  import('./charts/RepositoryComparison').then(module => ({ default: module.RepositoryComparison }))
)

// 차트 로딩 스피너 컴포넌트
const ChartLoadingSpinner = memo(() => (
  <div className="bg-white p-6 rounded-lg shadow-lg" role="status" aria-label="차트 로딩 중">
    <LoadingSpinner size="sm" message="차트를 불러오는 중..." />
  </div>
))

ChartLoadingSpinner.displayName = 'ChartLoadingSpinner'

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
      <div className="min-h-screen bg-gray-100" role="status" aria-label="대시보드 로딩 중">
        <LoadingSpinner message={MESSAGES.LOADING.DASHBOARD} className="min-h-screen" />
      </div>
    )
  }

  if (error || !stats || !chartData || !percentages) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" role="alert">
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
      <header className="bg-white shadow-sm border-b" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" id="dashboard-title">
                🚀 당근마켓 릴리즈 분석 대시보드
              </h1>
              <p className="mt-2 text-gray-600" id="dashboard-description">
                daangn/stackflow와 daangn/seed-design 리포지토리의 릴리즈 패턴 분석
              </p>
            </div>
            <button
              onClick={refresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="대시보드 데이터 새로고침"
              type="button"
            >
              새로고침
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
        aria-labelledby="dashboard-title"
        aria-describedby="dashboard-description"
      >
        {/* Stats Cards */}
        <section className="mb-8" aria-labelledby="stats-section-title">
          <h2 id="stats-section-title" className="sr-only">
            릴리즈 통계 요약
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            role="group"
            aria-label="릴리즈 통계 카드"
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              role="region"
              aria-labelledby="total-releases-title"
            >
              <h3 id="total-releases-title" className="text-sm font-medium text-gray-500">
                총 릴리즈
              </h3>
              <p
                className="text-3xl font-bold text-blue-600"
                aria-describedby="total-releases-title"
              >
                {stats.totalReleases}
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              role="region"
              aria-labelledby="weekday-releases-title"
            >
              <h3 id="weekday-releases-title" className="text-sm font-medium text-gray-500">
                평일 릴리즈
              </h3>
              <p
                className="text-3xl font-bold text-green-600"
                aria-describedby="weekday-releases-title"
              >
                {stats.weekdayReleases}
              </p>
              <p
                className="text-sm text-gray-500"
                aria-label={`전체의 ${percentages.weekday}퍼센트`}
              >
                ({percentages.weekday}%)
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              role="region"
              aria-labelledby="prereleases-title"
            >
              <h3 id="prereleases-title" className="text-sm font-medium text-gray-500">
                프리릴리즈
              </h3>
              <p
                className="text-3xl font-bold text-yellow-600"
                aria-describedby="prereleases-title"
              >
                {stats.prereleases}
              </p>
              <p
                className="text-sm text-gray-500"
                aria-label={`전체의 ${percentages.prerelease}퍼센트`}
              >
                ({percentages.prerelease}%)
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              role="region"
              aria-labelledby="hotfixes-title"
            >
              <h3 id="hotfixes-title" className="text-sm font-medium text-gray-500">
                핫픽스
              </h3>
              <p className="text-3xl font-bold text-red-600" aria-describedby="hotfixes-title">
                {stats.hotfixes}
              </p>
              <p
                className="text-sm text-gray-500"
                aria-label={`전체의 ${percentages.hotfix}퍼센트`}
              >
                ({percentages.hotfix}%)
              </p>
            </div>
          </div>
        </section>

        {/* Charts Grid */}
        <section aria-labelledby="charts-section-title">
          <h2 id="charts-section-title" className="sr-only">
            릴리즈 데이터 차트
          </h2>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            role="group"
            aria-label="데이터 시각화 차트"
          >
            <Suspense fallback={<ChartLoadingSpinner />}>
              <div role="img" aria-labelledby="monthly-trend-title">
                <ReleaseTrendByMonth data={chartData.monthlyTrend} />
              </div>
            </Suspense>
            <Suspense fallback={<ChartLoadingSpinner />}>
              <div role="img" aria-labelledby="timeslot-distribution-title">
                <ReleasesByTimeSlot data={chartData.timeSlotDistribution} />
              </div>
            </Suspense>
            <Suspense fallback={<ChartLoadingSpinner />}>
              <div role="img" aria-labelledby="type-distribution-title">
                <ReleaseTypeDistribution data={chartData.releaseTypeDistribution} />
              </div>
            </Suspense>
            <Suspense fallback={<ChartLoadingSpinner />}>
              <div role="img" aria-labelledby="repository-comparison-title">
                <RepositoryComparison data={chartData.repositoryComparison} />
              </div>
            </Suspense>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm" role="contentinfo">
          <p>데이터 소스: GitHub API • 마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
        </footer>
      </main>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'
