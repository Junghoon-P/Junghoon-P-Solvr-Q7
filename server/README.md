# 📡 Release Analysis Server

GitHub 릴리즈 데이터 분석 및 API 서버

## 📊 API 엔드포인트

### 릴리즈 데이터

- `GET /api/releases/data` - 향상된 릴리즈 데이터
- `GET /api/releases/stats` - 릴리즈 통계

### 사용자 관리

- `GET /api/users` - 사용자 목록
- `POST /api/users` - 사용자 생성
- `GET /api/users/:id` - 사용자 상세
- `PUT /api/users/:id` - 사용자 수정
- `DELETE /api/users/:id` - 사용자 삭제

### 헬스체크

- `GET /api/health` - 서버 상태 확인

## ⚙️ 기술 스택

- **Fastify** - 고성능 웹 프레임워크
- **TypeScript** - 타입 안전성
- **Drizzle ORM** - 타입 안전 ORM
- **Better SQLite3** - 경량 데이터베이스
- **Papa Parse** - CSV 파싱
- **Axios** - HTTP 클라이언트

## 📁 프로젝트 구조

```
src/
├── index.ts              # 서버 진입점
├── analyze-releases.ts   # GitHub 릴리즈 분석 스크립트
├── routes/
│   ├── index.ts         # 라우트 등록
│   ├── releaseRoutes.ts # 릴리즈 API 라우트
│   ├── userRoutes.ts    # 사용자 API 라우트
│   └── healthRoutes.ts  # 헬스체크 라우트
├── services/
│   └── userService.ts   # 사용자 비즈니스 로직
├── db/
│   ├── index.ts         # 데이터베이스 연결
│   ├── schema.ts        # 데이터베이스 스키마
│   └── migrate.ts       # 마이그레이션 관리
├── utils/
│   └── response.ts      # API 응답 헬퍼
├── config/
│   └── env.ts           # 환경 설정
└── types/
    └── context.ts       # 타입 정의
```


## 📈 릴리즈 분석 기능

- **GitHub API** 통합으로 릴리즈 데이터 수집
- **Stackflow** 및 **Seed Design** 저장소 분석
- 시간대별, 요일별, 계절별 릴리즈 패턴 분석
- 버전 타입 및 릴리즈 타입 분류
- 통계 데이터 CSV 생성
