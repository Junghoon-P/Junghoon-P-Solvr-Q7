import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { ReleaseData, ChartData } from '../../types/release'

interface Props {
  data: ReleaseData[]
}

export const ReleaseTrendByMonth = ({ data }: Props) => {
  const processData = (data: ReleaseData[]): ChartData[] => {
    // 월별로 그룹화
    const monthlyData = data.reduce(
      (acc, release) => {
        const monthKey = `${release['Year']}-${release['Month'].toString().padStart(2, '0')}`

        if (!acc[monthKey]) {
          acc[monthKey] = {
            total: 0,
            weekday: 0,
            year: release['Year'],
            month: release['Month'],
            monthName: release['Month Name']
          }
        }

        acc[monthKey].total++
        if (!release['Is Weekend']) {
          acc[monthKey].weekday++
        }

        return acc
      },
      {} as Record<string, any>
    )

    // 차트 데이터로 변환
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, stats]) => ({
        name: `${stats.monthName.slice(0, 3)} ${stats.year}`,
        totalReleases: stats.total,
        weekdayReleases: stats.weekday,
        weekendReleases: stats.total - stats.weekday
      }))
  }

  const chartData = processData(data)

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">월별 릴리즈 트렌드</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              value,
              name === 'totalReleases' ? '전체 릴리즈' : '평일 릴리즈'
            ]}
            labelFormatter={label => `기간: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="totalReleases"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ fill: '#8884d8' }}
          />
          <Line
            type="monotone"
            dataKey="weekdayReleases"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ fill: '#82ca9d' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
