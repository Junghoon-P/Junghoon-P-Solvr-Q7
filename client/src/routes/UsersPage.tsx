import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/api'
import { User } from '../types/user'

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await userService.getAll()
        setUsers(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('사용자 목록을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return
    }

    try {
      await userService.delete(id)
      setUsers(users.filter(user => user.id !== id))
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">사용자 관리</h1>
        <Link to="/users/new" className="btn btn-primary">
          새 사용자 추가
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-md p-8 text-center">
          <p className="text-neutral-600">등록된 사용자가 없습니다.</p>
          <Link to="/users/new" className="btn btn-primary mt-4">
            첫 사용자 추가하기
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-neutral-200 rounded-lg">
            <thead className="bg-neutral-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="py-4 px-4 whitespace-nowrap">{user.id}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{user.name}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{user.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
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
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/users/${user.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      보기
                    </Link>
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UsersPage
