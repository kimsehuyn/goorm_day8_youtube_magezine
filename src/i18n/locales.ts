export type Locale = 'en' | 'ko'

export interface Translations {
  nav: {
    discover: string
    rankings: string
    search: string
    notifications: string
  }
  sideNav: {
    brand: string
    subtitle: string
    home: string
    trending: string
    subscribe: string
  }
  home: {
    coverStory: string
    aiExecutiveSummary: string
    readStory: string
    trendingNow: string
    editorsPicks: string
    latestStories: string
    viewAll: string
    loadError: string
    noTrending: string
    apiHint: string
    featured: string
    editorsPick: string
  }
  article: {
    videoAnalysis: string
    published: string
    minRead: string
    by: string
    inThisArticle: string
    aiSummary: string
    keyInsights: string
    whyItMatters: string
    aiOpinion: string
    relatedVideos: string
    audience: string
    notFound: string
    returnHome: string
    aiWriting: string
    editorialError: string
    toc: string[]
  }
  rankings: {
    title: string
    description: string
    updatedRealtime: string
    updating: string
    loadNext: string
    subscribers: string
    growth30d: string
    aiQuality: string
    global: string
    technology: string
    culture: string
  }
  search: {
    placeholder: string
    close: string
    recentHistory: string
    noHistory: string
    trendingTopics: string
    curatedCollections: string
    curatedHint: string
    resultsFor: string
    searching: string
    noResults: string
    views: string
  }
  cards: {
    analysis: string
    insightScore: string
  }
  footer: {
    tagline: string
    platform: string
    legal: string
    about: string
    careers: string
    privacy: string
    terms: string
    api: string
  }
  categories: Record<string, string>
  trendingTopics: string[]
  error: {
    title: string
    returnHome: string
  }
  language: {
    en: string
    ko: string
    toggleLabel: string
  }
  auth: {
    reader: string
    editor: string
    login: string
    logout: string
    loginTitle: string
    loginDescription: string
    secretKey: string
    secretKeyPlaceholder: string
    loginSubmit: string
    loginError: string
    editorBadge: string
    editArticle: string
    saveArticle: string
    deleteArticle: string
    cancelEdit: string
    deleteConfirm: string
    saved: string
    deleted: string
    editorCurated: string
    headline: string
    summary: string
    whyItMatters: string
    aiOpinion: string
    audience: string
    category: string
    editorialBody: string
    keyInsightTitle: string
    keyInsightBody: string
    readerGateTitle: string
    readerGateDescription: string
    readerKey: string
    readerKeyPlaceholder: string
    readerEnter: string
    readerLoginError: string
    editorHint: string
  }
}

export const en: Translations = {
  nav: {
    discover: 'Discover',
    rankings: 'Rankings',
    search: 'Search',
    notifications: 'Notifications',
  },
  sideNav: {
    brand: 'YTMAG',
    subtitle: 'AI Editorial',
    home: 'Home',
    trending: 'Trending',
    subscribe: 'Subscribe Now',
  },
  home: {
    coverStory: 'Cover Story',
    aiExecutiveSummary: 'AI Executive Summary',
    readStory: 'Read Story',
    trendingNow: 'Trending Now',
    editorsPicks: "Editor's Picks",
    latestStories: 'Latest Stories',
    viewAll: 'View All',
    loadError: 'Unable to load magazine',
    noTrending: 'No trending videos found.',
    apiHint: 'Ensure YOUTUBE_API_KEY is set and the API server is running.',
    featured: 'Featured',
    editorsPick: "Editor's Pick",
  },
  article: {
    videoAnalysis: 'Video Analysis',
    published: 'Published',
    minRead: 'min read',
    by: 'By',
    inThisArticle: 'In This Article',
    aiSummary: 'AI Summary',
    keyInsights: 'Key Insights',
    whyItMatters: 'Why It Matters',
    aiOpinion: 'AI Opinion',
    relatedVideos: 'Related Viewing',
    audience: 'Audience',
    notFound: 'Article not found',
    returnHome: 'Return home',
    aiWriting: 'AI Editor is writing...',
    editorialError: 'Unable to generate AI editorial',
    toc: ['AI Summary', 'Key Insights', 'Why It Matters', 'AI Opinion', 'Related Videos'],
  },
  rankings: {
    title: 'Global Power Index',
    description:
      'The definitive ranking of digital influence, curated by our proprietary AI model assessing reach, engagement velocity, and editorial quality score.',
    updatedRealtime: 'Updated Real-Time',
    updating: 'Updating...',
    loadNext: 'Load Next 20',
    subscribers: 'Subscribers',
    growth30d: '30D Growth',
    aiQuality: 'AI Quality',
    global: 'Global',
    technology: 'Technology',
    culture: 'Culture',
  },
  search: {
    placeholder: 'Search YTMAG...',
    close: 'Close search',
    recentHistory: 'Recent History',
    noHistory: 'No recent searches yet.',
    trendingTopics: 'Trending Topics',
    curatedCollections: 'Curated Collections',
    curatedHint: 'Search for any YouTube topic to discover AI-curated magazine stories.',
    resultsFor: 'Results for',
    searching: 'Searching...',
    noResults: 'No results found.',
    views: 'views',
  },
  cards: {
    analysis: 'Analysis',
    insightScore: 'Insight Score',
  },
  footer: {
    tagline: 'High-fidelity journalism for the video age.',
    platform: 'Platform',
    legal: 'Legal',
    about: 'About',
    careers: 'Careers',
    privacy: 'Privacy',
    terms: 'Terms',
    api: 'API',
  },
  categories: {
    Technology: 'Technology',
    AI: 'AI',
    Finance: 'Finance',
    Lifestyle: 'Lifestyle',
    Gaming: 'Gaming',
    Travel: 'Travel',
    Music: 'Music',
    Design: 'Design',
    Culture: 'Culture',
    Featured: 'Featured',
  },
  trendingTopics: [
    'AI Filmmaking',
    'Creator Economy',
    'Sora vs Runway',
    'Retention Strategies',
    'MrBeast Analytics',
  ],
  error: {
    title: 'Something went wrong',
    returnHome: 'Return to homepage',
  },
  language: {
    en: 'EN',
    ko: 'KO',
    toggleLabel: 'Language',
  },
  auth: {
    reader: 'Reader',
    editor: 'Editor',
    login: 'Editor Login',
    logout: 'Logout',
    loginTitle: 'Editor Access',
    loginDescription: 'Enter your editor secret key to manage magazine content.',
    secretKey: 'Secret Key',
    secretKeyPlaceholder: 'Enter editor secret key',
    loginSubmit: 'Sign In',
    loginError: 'Invalid secret key',
    editorBadge: 'Editor',
    editArticle: 'Edit Article',
    saveArticle: 'Save Changes',
    deleteArticle: 'Delete & Regenerate',
    cancelEdit: 'Cancel',
    deleteConfirm: 'Delete this editorial and regenerate with AI?',
    saved: 'Article saved successfully',
    deleted: 'Editorial removed',
    editorCurated: 'Editor Curated',
    headline: 'Headline',
    summary: 'Summary',
    whyItMatters: 'Why It Matters',
    aiOpinion: 'AI Opinion',
    audience: 'Audience',
    category: 'Category',
    editorialBody: 'Editorial Body (one paragraph per line)',
    keyInsightTitle: 'Insight Title',
    keyInsightBody: 'Insight Body',
    readerGateTitle: 'Enter the Magazine',
    readerGateDescription: 'This is a private editorial experience. Enter your reader access key to continue.',
    readerKey: 'Reader Access Key',
    readerKeyPlaceholder: 'Enter reader access key',
    readerEnter: 'Enter Magazine',
    readerLoginError: 'Invalid reader access key',
    editorHint: 'Editors can sign in with their editor key here too.',
  },
}

export const ko: Translations = {
  nav: {
    discover: '발견',
    rankings: '랭킹',
    search: '검색',
    notifications: '알림',
  },
  sideNav: {
    brand: 'YTMAG',
    subtitle: 'AI 에디토리얼',
    home: '홈',
    trending: '트렌딩',
    subscribe: '구독하기',
  },
  home: {
    coverStory: '커버 스토리',
    aiExecutiveSummary: 'AI 핵심 요약',
    readStory: '기사 읽기',
    trendingNow: '지금 뜨는 콘텐츠',
    editorsPicks: '에디터 추천',
    latestStories: '최신 기사',
    viewAll: '전체 보기',
    loadError: '매거진을 불러올 수 없습니다',
    noTrending: '인기 영상을 찾을 수 없습니다.',
    apiHint: 'YOUTUBE_API_KEY 설정 및 API 서버 실행 여부를 확인하세요.',
    featured: 'Featured',
    editorsPick: '에디터 추천',
  },
  article: {
    videoAnalysis: '영상 분석',
    published: '게시',
    minRead: '분 읽기',
    by: '작성',
    inThisArticle: '이 기사에서',
    aiSummary: 'AI 요약',
    keyInsights: '핵심 인사이트',
    whyItMatters: '왜 중요한가',
    aiOpinion: 'AI 에디터 코멘트',
    relatedVideos: '관련 영상',
    audience: '추천 대상',
    notFound: '기사를 찾을 수 없습니다',
    returnHome: '홈으로 돌아가기',
    aiWriting: 'AI 에디터가 기사를 작성 중입니다...',
    editorialError: 'AI 기사를 생성할 수 없습니다',
    toc: ['AI 요약', '핵심 인사이트', '왜 중요한가', 'AI 에디터 코멘트', '관련 영상'],
  },
  rankings: {
    title: '글로벌 파워 인덱스',
    description:
      '도달률, 참여 속도, AI 편집 품질 점수를 종합 평가한 디지털 영향력 랭킹입니다.',
    updatedRealtime: '실시간 업데이트',
    updating: '업데이트 중...',
    loadNext: '다음 20개 불러오기',
    subscribers: '구독자',
    growth30d: '30일 성장',
    aiQuality: 'AI 품질',
    global: '글로벌',
    technology: '테크',
    culture: '컬처',
  },
  search: {
    placeholder: 'YTMAG 검색...',
    close: '검색 닫기',
    recentHistory: '최근 검색',
    noHistory: '최근 검색 기록이 없습니다.',
    trendingTopics: '트렌딩 토픽',
    curatedCollections: '큐레이션 컬렉션',
    curatedHint: 'YouTube 주제를 검색해 AI가 큐레이션한 매거진 기사를 만나보세요.',
    resultsFor: '검색 결과',
    searching: '검색 중...',
    noResults: '검색 결과가 없습니다.',
    views: '조회',
  },
  cards: {
    analysis: '분석',
    insightScore: '인사이트 점수',
  },
  footer: {
    tagline: '영상 시대를 위한 하이파이 저널리즘.',
    platform: '플랫폼',
    legal: '법적 고지',
    about: '소개',
    careers: '채용',
    privacy: '개인정보',
    terms: '이용약관',
    api: 'API',
  },
  categories: {
    Technology: '테크',
    AI: 'AI',
    Finance: '금융',
    Lifestyle: '라이프스타일',
    Gaming: '게임',
    Travel: '여행',
    Music: '음악',
    Design: '디자인',
    Culture: '컬처',
    Featured: 'Featured',
  },
  trendingTopics: [
    'AI 영상 제작',
    '크리에이터 경제',
    'Sora vs Runway',
    '시청 유지 전략',
    'MrBeast 분석',
  ],
  error: {
    title: '문제가 발생했습니다',
    returnHome: '홈으로 돌아가기',
  },
  language: {
    en: 'EN',
    ko: 'KO',
    toggleLabel: '언어',
  },
  auth: {
    reader: '독자',
    editor: '편집자',
    login: '편집자 로그인',
    logout: '로그아웃',
    loginTitle: '편집자 접속',
    loginDescription: '편집자 비밀키를 입력하면 콘텐츠를 생성·편집·삭제할 수 있습니다.',
    secretKey: '비밀키',
    secretKeyPlaceholder: '편집자 비밀키 입력',
    loginSubmit: '로그인',
    loginError: '비밀키가 올바르지 않습니다',
    editorBadge: '편집자',
    editArticle: '기사 편집',
    saveArticle: '저장',
    deleteArticle: '삭제 후 AI 재생성',
    cancelEdit: '취소',
    deleteConfirm: '편집본을 삭제하고 AI로 다시 생성할까요?',
    saved: '기사가 저장되었습니다',
    deleted: '편집본이 삭제되었습니다',
    editorCurated: '편집자 큐레이션',
    headline: '헤드라인',
    summary: '요약',
    whyItMatters: '왜 중요한가',
    aiOpinion: 'AI 에디터 코멘트',
    audience: '추천 대상',
    category: '카테고리',
    editorialBody: '본문 (한 단락씩 줄바꿈)',
    keyInsightTitle: '인사이트 제목',
    keyInsightBody: '인사이트 내용',
    readerGateTitle: '매거진 입장',
    readerGateDescription: '독자 전용 매거진입니다. 독자키를 입력하면 콘텐츠를 읽을 수 있습니다.',
    readerKey: '독자키',
    readerKeyPlaceholder: '독자키 입력',
    readerEnter: '매거진 입장',
    readerLoginError: '독자키가 올바르지 않습니다',
    editorHint: '편집자는 편집자키로도 입장할 수 있습니다.',
  },
}

const locales = { en, ko } as const

export function getTranslations(locale: Locale): Translations {
  return locales[locale]
}

export function translateCategory(locale: Locale, category: string): string {
  const t = getTranslations(locale)
  return t.categories[category] ?? category
}

export const RANKING_FILTER_KEYS = ['Global', 'Technology', 'Culture'] as const
export type RankingFilterKey = (typeof RANKING_FILTER_KEYS)[number]

export function getRankingFilterLabel(locale: Locale, key: RankingFilterKey): string {
  const t = getTranslations(locale)
  const map: Record<RankingFilterKey, string> = {
    Global: t.rankings.global,
    Technology: t.rankings.technology,
    Culture: t.rankings.culture,
  }
  return map[key]
}
