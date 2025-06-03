import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-700 mb-6">페이지를 찾을 수 없습니다</h2>
      <p className="text-neutral-600 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link to="/" className="btn btn-primary">
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFoundPage
