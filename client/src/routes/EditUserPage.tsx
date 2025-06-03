import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { userService } from '../services/api'
import { User, UserRole } from '../types/user'

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.USER)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await userService.getById(Number(id))
        setUser(data)
        setName(data.name)
        setEmail(data.email)
        setRole(data.role)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch user:', err)
        setError('사용자 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !id) return

    if (!name.trim() || !email.trim()) {
      setError('이름과 이메일은 필수 입력 항목입니다.')
      return
    }

    try {
      setSaving(true)
      await userService.update(Number(id), {
        name,
        email,
        role
      })
      navigate(`/users/${id}`)
    } catch (err) {
      console.error('Failed to update user:', err)
      setError('사용자 정보 수정에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-neutral-600">로딩 중...</div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <p>{error}</p>
        <Link to="/users" className="text-red-800 underline mt-2 inline-block">
          사용자 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">사용자 정보 수정</h1>
        <div className="flex space-x-2">
          <Link to={`/users/${id}`} className="btn btn-secondary">
            취소
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input"
              placeholder="사용자 이름"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input"
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-1">
              역할
            </label>
            <select
              id="role"
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="input"
            >
              <option value={UserRole.ADMIN}>관리자</option>
              <option value={UserRole.USER}>일반 사용자</option>
              <option value={UserRole.GUEST}>게스트</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserPage
