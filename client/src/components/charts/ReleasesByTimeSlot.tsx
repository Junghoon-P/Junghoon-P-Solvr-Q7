import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ChartContainer } from './ChartContainer'
import { CHART_COLORS, CHART_CONFIG, formatTimeSlot, sortByTimeSlot } from '../../utils/chartUtils'
import { TimeSlotProps } from '../../types/chart'

export const ReleasesByTimeSlot = ({ data }: TimeSlotProps) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환하고 정렬
  const chartData = sortByTimeSlot(
    data.map(item => ({
      name: formatTimeSlot(item.timeSlot),
      count: item.count,
      percentage: item.percentage
    }))
  )

  return (
    <ChartContainer title="시간대별 릴리즈 분포">
      <BarChart data={chartData}>
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
          formatter={(value: number, name: string) => [
            name === 'count' ? `${value}개` : `${value}%`,
            name === 'count' ? '릴리즈 수' : '비율'
          ]}
          labelStyle={{ color: '#333' }}
        />
        <Bar dataKey="count" fill={CHART_COLORS.PRIMARY} />
      </BarChart>
    </ChartContainer>
  )
}
