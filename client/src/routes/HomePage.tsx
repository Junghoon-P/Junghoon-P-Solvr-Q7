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
        <Link to="/users" className="btn btn-primary">
          유저 관리 시작하기
        </Link>
        <a
          href="https://github.com/yourusername/fullstack-boilerplate"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          GitHub 저장소
        </a>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">React + Vite</h2>
          <p className="text-neutral-600">
            빠른 개발 경험을 제공하는 React와 Vite를 사용하여 모던 UI를 구축합니다.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">TailwindCSS</h2>
          <p className="text-neutral-600">
            유틸리티 우선 CSS 프레임워크로 빠르고 유연한 디자인을 구현합니다.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Fastify + SQLite</h2>
          <p className="text-neutral-600">
            빠른 백엔드 API와 간편한 데이터베이스 관리를 제공합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
