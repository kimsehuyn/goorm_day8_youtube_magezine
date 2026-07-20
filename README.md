# YouTube Magazine AI

> **Discover the World's Best Videos.**  
> YouTube Data API의 객관적 데이터와 GPT의 편집·생성 능력을 결합한 **AI Editorial Magazine** 웹 앱입니다.

[SPEC 문서](doc/SPEC%20YouTube%20Magazine%20AI.md) Phase 1 MVP 기준으로 구현했으며, [UI 가이드](ui%20guide/)의 Premium Editorial AI 디자인 시스템을 React 앱으로 이식했습니다.

---

## 이번 작업 주요 내용

### 1. 프로젝트 스캐폴딩

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS v4
- **상태/라우팅**: TanStack Query v5, React Router v7, Framer Motion
- **Backend**: Express 개발 서버 (`server/dev-server.ts`) + Vercel Serverless Functions (`api/`)
- **디자인 토큰**: `ui guide/.../DESIGN.md`의 색상·타이포·간격을 `src/styles/globals.css` `@theme`에 반영
  - Playfair Display (헤드라인), Inter (본문)
  - Primary `#000`, Gold `#E3B341`, Background `#f9f9f9`

### 2. UI 페이지 (UI 가이드 4개 화면)

| 화면 | 경로 | 구현 내용 |
|------|------|-----------|
| **Homepage** | `/` | Cover Story Hero, Trending Bento Grid, Category Chips, Editor's Picks, Latest Stories |
| **Article Page** | `/article/:videoId` | AI Summary, Key Insights, Why It Matters, AI Opinion, Sticky TOC, Related Videos |
| **Rankings** | `/rankings` | Global / Technology / Culture 필터, Composite Score 랭킹 카드, sparkline |
| **Search** | 전역 오버레이 | Playfair Display 검색창, Recent History, Trending Topics, debounce 검색 결과 |

### 3. 공통 레이아웃 컴포넌트

- `TopNav` — sticky glass navigation, scroll 시 blur 전환
- `SideNav` — lg+ 좌측 사이드바
- `Footer` — editorial 4-column footer
- `AppLayout` — SideNav + main offset (`lg:ml-64`)
- `SearchOverlay` — TopNav 검색 아이콘 또는 `Ctrl+K` / `Cmd+K`

### 4. 백엔드 API

| 엔드포인트 | 설명 |
|------------|------|
| `GET /api/youtube/search?q=` | YouTube Search API + Videos API |
| `GET /api/youtube/trending` | chart=mostPopular 인기 영상 |
| `GET /api/youtube/video/:id` | 영상 메타·통계 |
| `GET /api/editorial/generate?videoId=` | GPT-4o-mini Structured Output 기사 생성 |
| `GET /api/rankings?category=` | Composite Score 채널 랭킹 |

### 5. GPT Editorial Engine

YouTube 메타데이터(제목, 설명, 태그, 조회수 등)를 입력으로 다음 필드를 JSON Schema로 생성합니다.

- `headline`, `summary`, `whyItMatters`, `keyInsights`, `aiOpinion`
- `audience`, `keyQuotes`, `category`, `qualityScore`, `editorialBody`

### 6. AI Ranking Engine (SPEC §10)

```
score = 0.40 × viewVelocity
      + 0.20 × engagementRate
      + 0.15 × subscriberNorm
      + 0.10 × uploadFrequency
      + 0.10 × gptQualityScore
      + 0.05 × trendScore
```

- Top 5 채널만 GPT quality score 호출 (API quota 절약)
- 나머지는 engagement 기반 추정

### 7. 캐싱 전략

- **서버**: in-memory Map (YouTube 5분, Editorial 24시간, Rankings 10분)
- **클라이언트**: TanStack Query staleTime + localStorage 검색 기록

---

## 오류 수정 및 빌드 이슈 해결

구현 과정에서 발생했던 문제와 해결 방법입니다.

| 이슈 | 원인 | 해결 |
|------|------|------|
| Vite 프로젝트 자동 생성 실패 | `doc/`, `ui guide/` 등 기존 파일이 있어 `create-vite`가 non-empty 디렉터리에서 취소됨 | `package.json`, `vite.config.ts`, `tsconfig` 등을 **수동 스캐폴딩** |
| `tsc -b` 빌드 실패 | `tsconfig.app.json` / `tsconfig.node.json`에 TypeScript 5.7 전용 옵션 `erasableSyntaxOnly`, `noUncheckedSideEffectImports` 사용 | 해당 옵션 **제거** 후 빌드 성공 |
| `api/youtube/search.ts` unused import | `generateEditorial`, `getVideoById` 미사용 import | 불필요 import **삭제** |
| API 키 노출 방지 | YouTube / OpenAI 키를 클라이언트에 두면 보안 위험 | 서버(`server/`, `api/`)에서만 사용, Vite proxy로 `/api/*` 프록시 |
| GPT 응답 지연 UX | 기사 생성에 5~15초 소요 | Skeleton UI + "AI Editor is writing..." 로딩 상태 표시 |
| YouTube API quota | search/trending/editorial 반복 호출 | 서버 캐시 + Top 5만 GPT quality score 호출 |

---

## 기술 스택

- React 19, Vite 6, TypeScript 5.7
- Tailwind CSS v4 (`@tailwindcss/vite`)
- TanStack Query, React Router, Framer Motion
- Express (로컬 API), Vercel Serverless (배포)
- YouTube Data API v3, OpenAI GPT-4o-mini

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 API 키를 입력합니다.

```env
YOUTUBE_API_KEY=your_youtube_data_api_key
OPENAI_API_KEY=your_openai_api_key
```

> `.env`는 `.gitignore`에 포함되어 있어 GitHub에 푸시되지 않습니다.

### 3. 개발 서버 실행

API + Frontend 동시 실행:

```bash
npm run dev:all
```

| 서비스 | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001 |

Vite dev server가 `/api/*` 요청을 로컬 API 서버로 프록시합니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

---

## 배포 (Vercel)

1. GitHub 리포지토리 연결
2. 환경 변수 설정: `YOUTUBE_API_KEY`, `OPENAI_API_KEY`
3. Deploy — `/api` 경로가 serverless function으로 동작 (`vercel.json` SPA fallback 포함)

---

## 프로젝트 구조

```
├── api/                    # Vercel serverless functions
│   ├── youtube/            # search, trending, video
│   ├── editorial/          # GPT 기사 생성
│   └── rankings/           # Composite Score 랭킹
├── server/
│   ├── dev-server.ts       # 로컬 Express API
│   └── lib/                # youtube, editorial, rankings, cache
├── src/
│   ├── components/         # layout, cards, ai, search, ui
│   ├── pages/              # Home, Article, Rankings
│   ├── contexts/           # SearchOverlay 상태
│   ├── lib/                # api client, utils
│   ├── styles/             # globals.css (design tokens)
│   └── types/
├── doc/                    # SPEC 문서
└── ui guide/               # Stitch UI HTML 목업 + DESIGN.md
```

---

## 리포지토리

- GitHub: [kimsehuyn/goorm_day8_youtube_magezine](https://github.com/kimsehuyn/goorm_day8_youtube_magezine)

---

## Phase 2 로드맵 (미구현)

- AI 트렌드 분석, AI 큐레이션 컬렉션
- Supabase / Upstash Redis 영구 캐시
- 다국어 번역, 개인화 추천

---

## 라이선스

Educational project — goorm day8
