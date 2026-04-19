import { ELEMENT_COLORS, MBTI_TRAITS, ELEMENT_DIRECTION } from './constants'

const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

const STEM_ELEMENT: Record<string, string> = {
  甲:'wood', 乙:'wood', 丙:'fire', 丁:'fire',
  戊:'earth', 己:'earth', 庚:'metal', 辛:'metal',
  壬:'water', 癸:'water',
}
const BRANCH_ELEMENT: Record<string, string> = {
  子:'water', 丑:'earth', 寅:'wood', 卯:'wood',
  辰:'earth', 巳:'fire', 午:'fire', 未:'earth',
  申:'metal', 酉:'metal', 戌:'earth', 亥:'water',
}

export function getDayGan(year: number, month: number, day: number): string {
  const base = new Date(1900, 0, 1).getTime()
  const target = new Date(year, month - 1, day).getTime()
  const diff = Math.floor((target - base) / 86400000)
  return STEMS[((diff % 10) + 10) % 10]
}

export function getYearPillar(year: number): { stem: string; branch: string } {
  const stem = STEMS[((year - 1900) % 10 + 10) % 10]
  const branch = BRANCHES[((year - 1900) % 12 + 12) % 12]
  return { stem, branch }
}

export function getMonthStem(year: number, month: number): string {
  const yi = STEMS.indexOf(getYearPillar(year).stem)
  return STEMS[((yi % 5) * 2 + month + 1) % 10]
}

export function getDominantElement(year: number, month: number, day: number): string {
  const dayStem = getDayGan(year, month, day)
  const yearPillar = getYearPillar(year)
  const monthStem = getMonthStem(year, month)
  const els: string[] = [
    STEM_ELEMENT[dayStem],
    STEM_ELEMENT[yearPillar.stem],
    BRANCH_ELEMENT[yearPillar.branch],
    STEM_ELEMENT[monthStem],
  ].filter(Boolean) as string[]
  const count: Record<string, number> = {}
  els.forEach(e => { count[e] = (count[e] || 0) + 1 })
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'earth'
}

export interface SajuProfile {
  name: string
  dayStem: string
  yearPillar: { stem: string; branch: string }
  dominantElement: string
  elementData: { bg: string; glow: string; emoji: string; name: string }
  directionData: {
    best: string[]; good: string[]; avoid: string[]
    region: string; regionDesc: string; houseType: string
  }
  mbtiTitle: string
  mbtiEmoji: string
  mbtiCore: string
  mbtiShadow: string
  wealthScore: number
}

export function buildProfile(
  name: string, year: number, month: number, day: number,
  mbti: string
): SajuProfile {
  const dayStem = getDayGan(year, month, day)
  const yearPillar = getYearPillar(year)
  const dominantElement = getDominantElement(year, month, day)
  const elementData = ELEMENT_COLORS[dominantElement] ?? ELEMENT_COLORS.earth
  const directionData = ELEMENT_DIRECTION[dominantElement] ?? ELEMENT_DIRECTION.earth
  const mbtiData = MBTI_TRAITS[mbti] ?? MBTI_TRAITS['INFP']
  const wealthMap: Record<string, number> = { metal: 9, earth: 8, water: 7, wood: 6, fire: 5 }
  const mbtiBonus: Record<string, number> = {
    ENTJ:2, ESTJ:2, ISTJ:1, INTJ:1, ESTP:1,
    ENFP:-1, INFP:-1, ISFP:-1,
  }
  const base = wealthMap[dominantElement] ?? 6
  const bonus = mbtiBonus[mbti] ?? 0
  const wealthScore = Math.min(10, Math.max(1, base + bonus))
  return {
    name, dayStem, yearPillar, dominantElement,
    elementData, directionData,
    mbtiTitle: mbtiData.title, mbtiEmoji: mbtiData.emoji,
    mbtiCore: mbtiData.core, mbtiShadow: mbtiData.shadow,
    wealthScore,
  }
}
