import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface MonthlyTrendData {
  month: string
  count: number
  year: number
}

interface Props {
  data: MonthlyTrendData[]
}

export const ReleaseTrendByMonth = ({ data }: Props) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환
  const chartData = data.map(item => ({
    name: `${item.month} ${item.year}`,
    totalReleases: item.count
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">월별 릴리즈 트렌드</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [value, '릴리즈 수']}
            labelFormatter={label => `기간: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="totalReleases"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ fill: '#8884d8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
