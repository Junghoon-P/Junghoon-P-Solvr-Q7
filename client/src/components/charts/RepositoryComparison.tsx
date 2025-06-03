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

interface RepositoryData {
  repository: string
  count: number
  percentage: number
}

interface Props {
  data: RepositoryData[]
}

export const RepositoryComparison = ({ data }: Props) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환
  const chartData = data.map(item => ({
    name: item.repository,
    releases: item.count,
    percentage: item.percentage
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">리포지토리별 릴리즈 비교</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="releases" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
