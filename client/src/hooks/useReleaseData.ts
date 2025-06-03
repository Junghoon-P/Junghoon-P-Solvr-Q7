import { useState, useEffect } from 'react'
import axios from 'axios'
import { ReleaseData } from '../types/release'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useReleaseData = () => {
  const [data, setData] = useState<ReleaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // 서버 API에서 릴리즈 데이터 가져오기
        const response = await axios.get(`${API_BASE_URL}/releases/data`)

        if (response.data.success) {
          setData(response.data.data)
          setError(null)
        } else {
          throw new Error(response.data.error || 'API 응답 실패')
        }
      } catch (err) {
        console.error('Error loading release data:', err)
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : err instanceof Error
            ? err.message
            : 'Unknown error'
        setError(errorMessage)

        // API 실패 시 목업 데이터 사용
        setData(generateMockData())
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}

// 개발용 목업 데이터 생성
const generateMockData = (): ReleaseData[] => {
  const mockData: ReleaseData[] = []
  const repos = ['daangn/stackflow', 'daangn/seed-design']
  const authors = ['dev1', 'dev2', 'dev3', 'dev4']
  const releaseTypes = ['stable', 'beta', 'alpha']
  const timeSlots = ['work_morning', 'work_afternoon', 'evening', 'night']
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  for (let i = 0; i < 50; i++) {
    const date = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const hour = Math.floor(Math.random() * 24)
    const dayOfWeek = date.getDay()
    const month = date.getMonth() + 1
    const quarter = Math.ceil(month / 3)

    mockData.push({
      Repository: repos[Math.floor(Math.random() * repos.length)],
      'Tag Name': `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      'Release Name': `Release ${i + 1}`,
      'Published At (ISO)': date.toISOString(),
      'Published Date': date.toISOString().split('T')[0],
      'Published Time': `${hour.toString().padStart(2, '0')}:00:00`,
      Author: authors[Math.floor(Math.random() * authors.length)],
      'Is Prerelease': Math.random() > 0.7,
      Year: date.getFullYear(),
      Month: month,
      Quarter: quarter,
      'Month Name': monthNames[date.getMonth()],
      'Week Number': Math.floor(Math.random() * 52) + 1,
      'Day of Week (0=Sun)': dayOfWeek,
      'Day Name': dayNames[dayOfWeek],
      'Hour (0-23)': hour,
      'Time Slot': timeSlots[Math.floor(Math.random() * timeSlots.length)],
      'Is Weekend': dayOfWeek === 0 || dayOfWeek === 6,
      'Season Quarter': `Q${quarter}_${['Winter', 'Spring', 'Summer', 'Fall'][Math.floor(Math.random() * 4)]}`,
      'Version Type': 'semantic',
      'Release Type': releaseTypes[Math.floor(Math.random() * releaseTypes.length)],
      'Is Major Version': Math.random() > 0.8,
      'Is Patch Version': Math.random() > 0.5,
      'Is Hotfix': Math.random() > 0.9,
      'Days Since Epoch': Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
    })
  }

  return mockData
}
