export const MBTI_TYPES = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
] as const

export const HOURS = [
  { value: 'unknown', label: '모름' },
  { value: '子', label: '자시 (23:00~01:00)' },
  { value: '丑', label: '축시 (01:00~03:00)' },
  { value: '寅', label: '인시 (03:00~05:00)' },
  { value: '卯', label: '묘시 (05:00~07:00)' },
  { value: '辰', label: '진시 (07:00~09:00)' },
  { value: '巳', label: '사시 (09:00~11:00)' },
  { value: '午', label: '오시 (11:00~13:00)' },
  { value: '未', label: '미시 (13:00~15:00)' },
  { value: '申', label: '신시 (15:00~17:00)' },
  { value: '酉', label: '유시 (17:00~19:00)' },
  { value: '戌', label: '술시 (19:00~21:00)' },
  { value: '亥', label: '해시 (21:00~23:00)' },
]

export const ELEMENT_COLORS: Record<string, { bg: string; glow: string; emoji: string; name: string }> = {
  wood:  { bg: '#22c55e', glow: '#16a34a', emoji: '🌳', name: '목(木)' },
  fire:  { bg: '#ef4444', glow: '#dc2626', emoji: '🔥', name: '화(火)' },
  earth: { bg: '#f59e0b', glow: '#d97706', emoji: '🌍', name: '토(土)' },
  metal: { bg: '#94a3b8', glow: '#64748b', emoji: '⚡', name: '금(金)' },
  water: { bg: '#3b82f6', glow: '#2563eb', emoji: '💧', name: '수(水)' },
}

export const MBTI_TRAITS: Record<string, { title: string; emoji: string; core: string; shadow: string }> = {
  INTJ: { title: '전략가',     emoji: '♟️', core: '냉철한 분석력과 장기 비전',    shadow: '감정 표현에 서툰 편' },
  INTP: { title: '논리술사',   emoji: '🔬', core: '끝없는 지적 탐구심',          shadow: '실행보다 이론에 치우침' },
  ENTJ: { title: '통솔자',     emoji: '👑', core: '강력한 리더십과 결단력',       shadow: '타인의 감정 간과' },
  ENTP: { title: '변론가',     emoji: '💡', core: '창의적 아이디어와 토론 능력',  shadow: '끈기 부족' },
  INFJ: { title: '옹호자',     emoji: '🌸', core: '깊은 통찰과 이상주의',        shadow: '완벽주의적 번아웃' },
  INFP: { title: '중재자',     emoji: '🦋', core: '풍부한 내면세계와 공감능력',  shadow: '현실도피 성향' },
  ENFJ: { title: '선도자',     emoji: '🌟', core: '타인을 이끄는 카리스마',      shadow: '자신을 희생하는 경향' },
  ENFP: { title: '활동가',     emoji: '🎪', core: '열정적 에너지와 가능성 탐색', shadow: '집중력 분산' },
  ISTJ: { title: '현실주의자', emoji: '🏛️', core: '신뢰할 수 있는 책임감',      shadow: '변화에 대한 저항' },
  ISFJ: { title: '수호자',     emoji: '🛡️', core: '헌신적인 보살핌과 성실함',   shadow: '자기주장 약함' },
  ESTJ: { title: '경영자',     emoji: '📋', core: '체계적 조직력과 추진력',      shadow: '융통성 부족' },
  ESFJ: { title: '집정관',     emoji: '🤝', core: '따뜻한 사교성과 배려심',     shadow: '타인 평가에 민감' },
  ISTP: { title: '장인',       emoji: '🔧', core: '냉정한 문제 해결 능력',       shadow: '감정적 거리감' },
  ISFP: { title: '모험가',     emoji: '🎨', core: '감각적 아름다움 추구',        shadow: '계획성 부족' },
  ESTP: { title: '사업가',     emoji: '🎯', core: '즉흥적 실행력과 적응력',      shadow: '장기 계획 약함' },
  ESFP: { title: '연예인',     emoji: '🎭', core: '생동감 넘치는 현재 집중',     shadow: '심층적 사고 부족' },
}

export const ELEMENT_DIRECTION: Record<string, {
  best: string[]; good: string[]; avoid: string[]
  region: string; regionDesc: string; houseType: string
}> = {
  wood:  {
    best: ['동(東)', '동남(東南)'],
    good: ['남(南)'],
    avoid: ['서(西)', '서북(西北)'],
    region: '강남·분당·판교',
    regionDesc: '녹지·숲·공원 인접 지역, 신도시 개발지',
    houseType: '채광 좋은 동향·남동향 아파트, 숲세권',
  },
  fire:  {
    best: ['남(南)', '동남(東南)'],
    good: ['동(東)'],
    avoid: ['북(北)', '서북(西北)'],
    region: '서울 도심·강남·마포',
    regionDesc: '번화가·상업지구·교통 요충지',
    houseType: '조망권 좋은 고층, 남향 정남 배치',
  },
  earth: {
    best: ['중앙', '서남(西南)'],
    good: ['남(南)', '서(西)'],
    avoid: ['동(東)', '동북(東北)'],
    region: '수도권 중심부·세종·대전',
    regionDesc: '안정적 구도심, 인프라 완비 지역',
    houseType: '넓고 안정감 있는 구조, 저층 단독·빌라',
  },
  metal: {
    best: ['서(西)', '서북(西北)'],
    good: ['북(北)'],
    avoid: ['남(南)', '동남(東南)'],
    region: '김포·인천·일산·경기 서부',
    regionDesc: '개발 예정지, 산업단지 인접 가치상승 지역',
    houseType: '깔끔한 신축 아파트, 정서향·북서향',
  },
  water: {
    best: ['북(北)', '동북(東北)'],
    good: ['서(西)'],
    avoid: ['남(南)', '동남(東南)'],
    region: '한강변·수변도시·강북·노원',
    regionDesc: '물 인접 지역, 조용한 주거 환경',
    houseType: '수변·한강뷰, 북향이라도 뷰가 좋은 주거',
  },
}
