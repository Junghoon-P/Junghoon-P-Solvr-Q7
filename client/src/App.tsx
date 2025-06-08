import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary, LoadingSpinner } from './components/common'
import { MESSAGES } from './constants'
import { lazy, Suspense } from 'react'

// 라우트 컴포넌트들을 lazy loading으로 변경
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const HomePage = lazy(() => import('./routes/HomePage'))
const UsersPage = lazy(() => import('./routes/UsersPage'))
const UserDetailPage = lazy(() => import('./routes/UserDetailPage'))
const CreateUserPage = lazy(() => import('./routes/CreateUserPage'))
const EditUserPage = lazy(() => import('./routes/EditUserPage'))
const NotFoundPage = lazy(() => import('./routes/NotFoundPage'))
const Dashboard = lazy(() =>
  import('./components/Dashboard').then(module => ({ default: module.Dashboard }))
)

// 페이지 로딩 컴포넌트
const PageLoadingSpinner = () => (
  <div className="min-h-screen bg-gray-100">
    <LoadingSpinner message={MESSAGES.LOADING.DEFAULT} className="min-h-screen" />
  </div>
)

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 에러 로깅 서비스 연동 가능
        console.error('App Error:', error, errorInfo)
      }}
    >
      <Suspense fallback={<PageLoadingSpinner />}>
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
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
