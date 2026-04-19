import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { buildProfile } from '../lib/saju'
import { MBTI_TYPES, HOURS } from '../lib/constants'

const GOLD = '#d4a853'
const BG = 'linear-gradient(135deg, #0a0a0f 0%, #0f1729 50%, #0a0f1a 100%)'
const INTERESTS = [
  { value: 'buy', label: '🏠 매수 (구매)' },
  { value: 'sell', label: '💸 매도 (판매)' },
  { value: 'move', label: '📦 이사 계획' },
  { value: 'invest', label: '📈 투자 검토' },
  { value: 'rent', label: '🔑 임대차 계약' },
]
export default function Analyze() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', birthYear: '', birthMonth: '', birthDay: '',
    birthHour: 'unknown', gender: '', mbti: '',
    interest: '', currentRegion: '', targetRegion: '',
  })
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const validate = () => {
    if (!form.name.trim()) return '이름을 입력해주세요'
    if (!form.birthYear || !form.birthMonth || !form.birthDay) return '생년월일을 입력해주세요'
    const y = parseInt(form.birthYear)
    if (isNaN(y) || y < 1930 || y > 2010) return '1930~2010년 사이로 입력해주세요'
    if (parseInt(form.birthMonth) < 1 || parseInt(form.birthMonth) > 12) return '올바른 월을 입력해주세요'
    if (parseInt(form.birthDay) < 1 || parseInt(form.birthDay) > 31) return '올바른 일을 입력해주세요'
    if (!form.gender) return '성별을 선택해주세요'
    if (!form.mbti) return 'MBTI를 선택해주세요'
    if (!form.interest) return '관심 부동산 유형을 선택해주세요'
    return null
  }
  const handleSubmit = async () => {
    const err = validate()
    if (err) { toast.error(err); return }
    setLoading(true)
    try {
      const y = parseInt(form.birthYear)
      const m = parseInt(form.birthMonth)
      const d = parseInt(form.birthDay)
      const profile = buildProfile(form.name, y, m, d, form.mbti)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, year: y, month: m, day: d,
          birthHour: form.birthHour, gender: form.gender, mbti: form.mbti,
          interest: form.interest,
          currentRegion: form.currentRegion || '미입력',
          targetRegion: form.targetRegion || '미입력',
          dayStem: profile.dayStem,
          yearPillar: `${profile.yearPillar.stem}${profile.yearPillar.branch}`,
          element: profile.elementData.name,
          mbtiTitle: profile.mbtiTitle,
          directionBest: profile.directionData.best.join(', '),
          wealthScore: profile.wealthScore,
        }),
      })
      const { aiAnalysis } = await res.json()
      navigate('/result', { state: { profile, form, aiAnalysis } })
    } catch {
      toast.error('AI 분석 중 오류가 발생했어요.')
    } finally {
      setLoading(false)
    }
  }
  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 15,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', outline: 'none', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    color: 'rgba(255,255,255,0.55)', fontSize: 13, display: 'block', marginBottom: 8,
  }
