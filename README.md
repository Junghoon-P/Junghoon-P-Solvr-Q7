# 🚀 릴리즈 분석 대시보드

Stackflow와 Seed Design 프로젝트의 GitHub 릴리즈 데이터를 분석하고 시각화하는 풀스택 웹 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 GitHub 릴리즈 데이터를 수집, 분석하여 다양한 통계와 트렌드를 제공하는 대시보드입니다.

### 🎯 주요 기능

- **릴리즈 통계**: 총 릴리즈 수, 평일/주말 릴리즈, 프리릴리즈, 핫픽스 통계
- **월별 트렌드**: 시간에 따른 릴리즈 패턴 분석
- **타입 분포**: Stable vs Prerelease 릴리즈 비율
- **리포지토리 비교**: Stackflow vs Seed Design 릴리즈 비교
- **시간대별 분석**: 하루 중 릴리즈가 많이 발생하는 시간대 분석

## 🏗️ 프로젝트 구조

```
├── client/          # React + Vite 프론트엔드
├── server/          # Fastify 백엔드 API
├── package.json     # 워크스페이스 설정
└── pnpm-workspace.yaml
```

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+
- pnpm 8+


## 🛠️ 기술 스택

### 프론트엔드

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 툴
- **Tailwind CSS** - 스타일링
- **Recharts** - 데이터 시각화

### 백엔드

- **Fastify** - 웹 프레임워크
- **TypeScript** - 타입 안전성
- **Papa Parse** - CSV 파싱
- **fs/csv-parser** - 파일 처리

## 📈 데이터 플로우

1. **데이터 수집**: GitHub API에서 릴리즈 데이터 수집
2. **데이터 처리**: CSV 파일로 변환 및 메타데이터 추가
3. **메모리 로딩**: 서버 시작시 데이터를 메모리에 로드
4. **API 제공**: RESTful API로 처리된 데이터 제공
5. **시각화**: React 컴포넌트로 차트 렌더링


## 📝 개발 가이드

자세한 개발 가이드는 각 디렉토리의 README를 참조하세요:

- [클라이언트 개발 가이드](./client/README.md)
- [서버 개발 가이드](./server/README.md)

## 🔄 변경 로그

주요 변경사항은 [CHANGELOG.md](./CHANGELOG.md)를 참조하세요.
