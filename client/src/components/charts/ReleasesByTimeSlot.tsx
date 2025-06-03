import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TimeSlotData {
  timeSlot: string
  count: number
  percentage: number
}

interface Props {
  data: TimeSlotData[]
}

export const ReleasesByTimeSlot = ({ data }: Props) => {
  // 서버에서 받은 데이터를 차트 형식으로 변환
  const chartData = data.map(item => ({
    name: item.timeSlot.replace('_', ' ').toUpperCase(),
    count: item.count,
    percentage: item.percentage
  }))

  // 시간순으로 정렬
  const timeOrder = [
    'EARLY MORNING',
    'MORNING',
    'WORK MORNING',
    'LUNCH TIME',
    'WORK AFTERNOON',
    'EVENING',
    'NIGHT'
  ]
  chartData.sort((a, b) => timeOrder.indexOf(a.name) - timeOrder.indexOf(b.name))

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">시간대별 릴리즈 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              name === 'count' ? `${value}개` : `${value}%`,
              name === 'count' ? '릴리즈 수' : '비율'
            ]}
            labelStyle={{ color: '#333' }}
          />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
