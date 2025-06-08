import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { MonthlyTrendProps } from '../../types/chart'
import { CHART_COLORS, CHART_CONFIG } from '../../utils/chartUtils'
import { ChartContainer } from './ChartContainer'

export const ReleaseTrendByMonth = ({ data }: MonthlyTrendProps) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환
  const chartData = data.map(item => ({
    name: `${item.month} ${item.year}`,
    totalReleases: item.count
  }))

  return (
    <ChartContainer title="월별 릴리즈 트렌드">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: CHART_CONFIG.AXIS.FONT_SIZE }}
          angle={CHART_CONFIG.AXIS.ANGLE}
          textAnchor="end"
          height={CHART_CONFIG.AXIS.HEIGHT}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`${value}개`, '릴리즈 수']}
          labelFormatter={label => `기간: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="totalReleases"
          stroke={CHART_COLORS.PRIMARY}
          strokeWidth={2}
          dot={{ fill: CHART_COLORS.PRIMARY }}
        />
      </LineChart>
    </ChartContainer>
  )
}
