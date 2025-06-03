import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-neutral-900 mb-6">풀스택 보일러플레이트</h1>
      <p className="text-xl text-neutral-600 mb-8">
        React, Vite, TailwindCSS, Fastify, SQLite를 활용한 풀스택 웹 애플리케이션
        보일러플레이트입니다.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/dashboard" className="btn btn-primary">
          🚀 릴리즈 분석 대시보드
        </Link>
        <Link to="/users" className="btn btn-secondary">
          유저 관리 시작하기
        </Link>
        <a
          href="https://github.com/yourusername/fullstack-boilerplate"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          GitHub 저장소
        </a>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">릴리즈 분석</h2>
          <p className="text-neutral-600">
            당근마켓 리포지토리의 릴리즈 패턴을 시각화하여 팀의 배포 트렌드를 분석합니다.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">React + Recharts</h2>
          <p className="text-neutral-600">
            인터랙티브한 차트와 대시보드로 데이터를 직관적으로 표현합니다.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">TypeScript</h2>
          <p className="text-neutral-600">
            타입 안전성을 보장하여 안정적인 데이터 분석 애플리케이션을 구축합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
