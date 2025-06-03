import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ReleaseData } from '../../types/release'

interface Props {
  data: ReleaseData[]
}

export const ReleasesByTimeSlot = ({ data }: Props) => {
  const chartData = data.reduce(
    (acc, release) => {
      const existing = acc.find(item => item.time_slot === release['Time Slot'])
      if (existing) {
        existing.count++
      } else {
        acc.push({
          time_slot: release['Time Slot'],
          count: 1,
          name: release['Time Slot'].replace('_', ' ').toUpperCase()
        })
      }
      return acc
    },
    [] as { time_slot: string; count: number; name: string }[]
  )
  // 시간순으로 정렬
  const timeOrder = [
    'early_morning',
    'morning',
    'work_morning',
    'lunch_time',
    'work_afternoon',
    'evening',
    'night'
  ]
  chartData.sort((a, b) => timeOrder.indexOf(a.time_slot) - timeOrder.indexOf(b.time_slot))

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">시간대별 릴리즈 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [value, '릴리즈 수']}
            labelStyle={{ color: '#333' }}
          />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
