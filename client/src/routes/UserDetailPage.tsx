import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/api'
import { User } from '../types/user'

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await userService.getById(Number(id))
        setUser(data)
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

  const handleDelete = async () => {
    if (!user) return

    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return
    }

    try {
      await userService.delete(user.id)
      navigate('/users')
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('사용자 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-neutral-600">로딩 중...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <p>{error || '사용자를 찾을 수 없습니다.'}</p>
        <Link to="/users" className="text-red-800 underline mt-2 inline-block">
          사용자 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">사용자 상세 정보</h1>
        <div className="flex space-x-2">
          <Link to="/users" className="btn btn-secondary">
            목록으로
          </Link>
          <Link to={`/users/${user.id}/edit`} className="btn btn-primary">
            수정
          </Link>
          <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">
            삭제
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-neutral-500">ID</h2>
              <p className="mt-1 text-lg text-neutral-900">{user.id}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-neutral-500">이름</h2>
              <p className="mt-1 text-lg text-neutral-900">{user.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-neutral-500">이메일</h2>
              <p className="mt-1 text-lg text-neutral-900">{user.email}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-neutral-500">역할</h2>
              <p className="mt-1">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'USER'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {user.role}
                </span>
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-neutral-500">생성일</h2>
              <p className="mt-1 text-lg text-neutral-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-neutral-500">수정일</h2>
              <p className="mt-1 text-lg text-neutral-900">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailPage
