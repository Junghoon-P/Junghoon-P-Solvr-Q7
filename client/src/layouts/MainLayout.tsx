import { Outlet, Link } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                풀스택 보일러플레이트
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                홈
              </Link>
              <Link
                to="/users"
                className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                유저 관리
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} 풀스택 보일러플레이트. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
