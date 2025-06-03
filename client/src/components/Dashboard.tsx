import { useDashboardData } from '../hooks/useDashboardData'
import { ReleasesByTimeSlot } from './charts/ReleasesByTimeSlot'
import { ReleaseTrendByMonth } from './charts/ReleaseTrendByMonth'
import { ReleaseTypeDistribution } from './charts/ReleaseTypeDistribution'
import { RepositoryComparison } from './charts/RepositoryComparison'

export const Dashboard = () => {
  const { stats, chartData, loading, error, refresh } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">대시보드 데이터를 로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !stats || !chartData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">데이터 로딩 오류</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  const weekdayPercentage = ((stats.weekdayReleases / stats.totalReleases) * 100).toFixed(1)
  const prereleasePercentage = ((stats.prereleases / stats.totalReleases) * 100).toFixed(1)
  const hotfixPercentage = ((stats.hotfixes / stats.totalReleases) * 100).toFixed(1)

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
            <p className="text-sm text-gray-500">({weekdayPercentage}%)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">프리릴리즈</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.prereleases}</p>
            <p className="text-sm text-gray-500">({prereleasePercentage}%)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">핫픽스</h3>
            <p className="text-3xl font-bold text-red-600">{stats.hotfixes}</p>
            <p className="text-sm text-gray-500">({hotfixPercentage}%)</p>
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
}
