import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { ReleaseData, ChartData } from '../../types/release'

interface Props {
  data: ReleaseData[]
}

export const RepositoryComparison = ({ data }: Props) => {
  const processData = (data: ReleaseData[]): ChartData[] => {
    const repoStats = data.reduce(
      (acc, release) => {
        const repo = release['Repository']

        if (!acc[repo]) {
          acc[repo] = {
            total: 0,
            major: 0,
            patch: 0,
            prerelease: 0,
            hotfix: 0
          }
        }

        acc[repo].total++
        if (release['Is Major Version']) acc[repo].major++
        if (release['Is Patch Version']) acc[repo].patch++
        if (release['Is Prerelease']) acc[repo].prerelease++
        if (release['Is Hotfix']) acc[repo].hotfix++

        return acc
      },
      {} as Record<string, any>
    )

    return Object.entries(repoStats).map(([name, stats]) => ({
      name: name.split('/')[1] || name, // 짧은 이름 사용
      ...stats
    }))
  }

  const chartData = processData(data)

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">리포지토리별 릴리즈 비교</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                total: '총 릴리즈',
                major: '메이저 버전',
                patch: '패치 버전',
                prerelease: '프리릴리즈',
                hotfix: '핫픽스'
              }
              return [value, labels[name] || name]
            }}
          />
          <Legend
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                total: '총 릴리즈',
                major: '메이저 버전',
                patch: '패치 버전',
                prerelease: '프리릴리즈',
                hotfix: '핫픽스'
              }
              return labels[value] || value
            }}
          />
          <Bar dataKey="total" fill="#8884d8" />
          <Bar dataKey="major" fill="#82ca9d" />
          <Bar dataKey="patch" fill="#ffc658" />
          <Bar dataKey="prerelease" fill="#ff7300" />
          <Bar dataKey="hotfix" fill="#ff0000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
