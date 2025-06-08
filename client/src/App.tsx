import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/common'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import UsersPage from './routes/UsersPage'
import UserDetailPage from './routes/UserDetailPage'
import CreateUserPage from './routes/CreateUserPage'
import EditUserPage from './routes/EditUserPage'
import NotFoundPage from './routes/NotFoundPage'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 에러 로깅 서비스 연동 가능
        console.error('App Error:', error, errorInfo)
      }}
    >
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users">
            <Route index element={<UsersPage />} />
            <Route path="new" element={<CreateUserPage />} />
            <Route path=":id" element={<UserDetailPage />} />
            <Route path=":id/edit" element={<EditUserPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
