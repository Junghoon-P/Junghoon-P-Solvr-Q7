import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartData, ReleaseData } from '../../types/release'

interface Props {
  data: ReleaseData[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export const ReleaseTypeDistribution = ({ data }: Props) => {
  const processData = (data: ReleaseData[]): ChartData[] => {
    const typeCount = data.reduce(
      (acc, release) => {
        const type = release['Is Prerelease'] ? 'Prerelease' : 'Stable'
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return Object.entries(typeCount).map(([name, value]) => ({
      name,
      value
    }))
  }

  const chartData = processData(data)

  const renderLabel = (entry: { name: string; value: number; percent: number }) => {
    return `${entry.name}: ${entry.percent.toFixed(1)}%`
  }

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
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, '릴리즈 수']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
