import { useState, useEffect } from 'react'
import axios from 'axios'
import { DashboardStats, ChartData, StatsResponse, ChartDataResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

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

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // 병렬로 통계와 차트 데이터 요청
        const [statsResponse, chartResponse] = await Promise.all([
          axios.get<StatsResponse>(`${API_BASE_URL}/releases/stats`),
          axios.get<ChartDataResponse>(`${API_BASE_URL}/releases/charts`)
        ])

        if (statsResponse.data.success && chartResponse.data.success) {
          setState({
            stats: statsResponse.data.data!,
            chartData: chartResponse.data.data!,
            loading: false,
            error: null
          })
        } else {
          throw new Error('API 응답 실패')
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : err instanceof Error
            ? err.message
            : 'Unknown error'

        setState({
          stats: null,
          chartData: null,
          loading: false,
          error: errorMessage
        })
      }
    }

    loadDashboardData()
  }, [])

  const refresh = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // 서버 데이터 새로고침 요청
      await axios.post(`${API_BASE_URL}/releases/refresh`)

      // 새 데이터 로드
      const [statsResponse, chartResponse] = await Promise.all([
        axios.get<StatsResponse>(`${API_BASE_URL}/releases/stats`),
        axios.get<ChartDataResponse>(`${API_BASE_URL}/releases/charts`)
      ])

      if (statsResponse.data.success && chartResponse.data.success) {
        setState({
          stats: statsResponse.data.data!,
          chartData: chartResponse.data.data!,
          loading: false,
          error: null
        })
      }
    } catch (err) {
      console.error('Error refreshing dashboard data:', err)
      setState(prev => ({
        ...prev,
        loading: false,
        error: '데이터 새로고침에 실패했습니다.'
      }))
    }
  }

  return {
    stats: state.stats,
    chartData: state.chartData,
    loading: state.loading,
    error: state.error,
    refresh
  }
}
