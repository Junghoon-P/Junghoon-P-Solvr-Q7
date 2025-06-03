# Changelog

릴리즈 분석 서버의 모든 변경사항을 문서화합니다.

### Added

- GitHub 릴리즈 데이터 분석 스크립트 (`analyze-releases.ts`)
- SQLite 데이터베이스 및 Drizzle ORM 통합
- 사용자 관리 시스템 (CRUD API)
- 헬스체크 엔드포인트
- 데이터베이스 마이그레이션 시스템
- 환경 설정 관리
- 타입 안전 컨텍스트 시스템

### Features

- **릴리즈 분석**

  - Stackflow 및 Seed Design 저장소 자동 분석
  - 시간대별, 요일별, 계절별 패턴 분석
  - 버전 타입 분류 (major, minor, patch)
  - 릴리즈 타입 분류 (stable, alpha, beta, rc)
  - 통계 데이터 CSV 생성

- **API 엔드포인트**

  - `/api/releases/data` - 향상된 릴리즈 데이터
  - `/api/releases/stats` - 릴리즈 통계
  - `/api/users/*` - 사용자 관리 CRUD
  - `/api/health` - 서버 상태 확인

- **데이터베이스**
  - Better SQLite3 데이터베이스
  - Drizzle ORM 스키마 정의
  - 자동 마이그레이션 시스템

### Technical

- **프레임워크**: Fastify 5.x
- **언어**: TypeScript 5.x
- **데이터베이스**: Better SQLite3 + Drizzle ORM
- **패키지 관리**: pnpm
- **테스트**: Vitest
- **로깅**: Pino + Pretty 포맷터
- **CORS**: 개발환경 지원
- **환경 설정**: dotenv-safe

### Infrastructure

- Node.js 22+ 요구사항
- 타입 안전 설정
- 프로덕션 빌드 지원
- 개발 서버 핫 리로드 (tsx watch)
