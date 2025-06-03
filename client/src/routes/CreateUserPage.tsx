import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userService } from '../services/api'
import { UserRole } from '../types/user'

const CreateUserPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.USER)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      setError('이름과 이메일은 필수 입력 항목입니다.')
      return
    }

    try {
      setLoading(true)
      await userService.create({
        name,
        email,
        role
      })
      navigate('/users')
    } catch (err) {
      console.error('Failed to create user:', err)
      setError('사용자 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">새 사용자 추가</h1>
        <Link to="/users" className="btn btn-secondary">
          취소
        </Link>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '처리 중...' : '사용자 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUserPage
