import { useState, useEffect, useCallback, useMemo } from 'react'
import { DashboardStats, ChartData } from '../types/api'
import { releaseService } from '../services/api'
import { MESSAGES } from '../constants'

interface DashboardDataState {
  stats: DashboardStats | null
  chartData: ChartData | null
  loading: boolean
  error: string | null
}

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardDataState>({
    stats: null,
    chartData: null,
    loading: true,
    error: null
  })

  // API 호출 함수들을 useCallback으로 메모화
  const fetchDashboardData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // 병렬로 통계와 차트 데이터 요청
      const [stats, chartData] = await Promise.all([
        releaseService.getStats<DashboardStats>(),
        releaseService.getCharts<ChartData>()
      ])

      setState({
        stats,
        chartData,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.DEFAULT

      setState({
        stats: null,
        chartData: null,
        loading: false,
        error: errorMessage
      })
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // 서버 데이터 새로고침 요청
      await releaseService.refresh()

      // 새 데이터 로드
      const [stats, chartData] = await Promise.all([
        releaseService.getStats<DashboardStats>(),
        releaseService.getCharts<ChartData>()
      ])

      setState({
        stats,
        chartData,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error refreshing dashboard data:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: MESSAGES.ERROR.REFRESH_FAILED
      }))
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // 반환값을 useMemo로 메모화하여 객체 참조 안정성 확보
  return useMemo(
    () => ({
      stats: state.stats,
      chartData: state.chartData,
      loading: state.loading,
      error: state.error,
      refresh
    }),
    [state.stats, state.chartData, state.loading, state.error, refresh]
  )
}
