import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { ChartContainer } from './ChartContainer'
import { CHART_COLORS, CHART_CONFIG } from '../../utils/chartUtils'
import { RepositoryProps } from '../../types/chart'

export const RepositoryComparison = ({ data }: RepositoryProps) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환
  const chartData = data.map(item => ({
    name: item.repository,
    releases: item.count,
    percentage: item.percentage
  }))

  return (
    <ChartContainer title="리포지토리별 릴리즈 비교">
      <BarChart data={chartData} margin={CHART_CONFIG.MARGIN}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number, name: string) => [
            name === 'releases' ? `${value}개` : `${value}%`,
            name === 'releases' ? '릴리즈 수' : '비율'
          ]}
        />
        <Legend formatter={(value: string) => (value === 'releases' ? '릴리즈 수' : '비율')} />
        <Bar dataKey="releases" fill={CHART_COLORS.PRIMARY} />
      </BarChart>
    </ChartContainer>
  )
}
