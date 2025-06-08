import { memo, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { ChartContainer } from './ChartContainer'
import { CHART_COLORS } from '../../utils/chartUtils'
import { ReleaseTypeProps } from '../../types/chart'

export const ReleaseTypeDistribution = memo(({ data }: ReleaseTypeProps) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환 (메모화)
  const chartData = useMemo(
    () =>
      data.map(item => ({
        name: item.type,
        value: item.count,
        percentage: item.percentage
      })),
    [data]
  )

  return (
    <ChartContainer title="릴리즈 타입 분포">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS.PIE_COLORS[index % CHART_COLORS.PIE_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value: number, name: string) => [`${value}개`, name]} />
        <Legend />
      </PieChart>
    </ChartContainer>
  )
})

ReleaseTypeDistribution.displayName = 'ReleaseTypeDistribution'
