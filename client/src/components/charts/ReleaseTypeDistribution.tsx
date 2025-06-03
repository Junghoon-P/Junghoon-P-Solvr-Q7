import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ReleaseTypeData {
  type: string
  count: number
  percentage: number
}

interface Props {
  data: ReleaseTypeData[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export const ReleaseTypeDistribution = ({ data }: Props) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환
  const chartData = data.map(item => ({
    name: item.type,
    value: item.count,
    percentage: item.percentage
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">릴리즈 타입 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}개`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
