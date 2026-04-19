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
          birthHour: form.birthHour,
          gender: form.gender, mbti: form.mbti,
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
      toast.error('AI 분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.')
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

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '24px 20px', fontFamily: "'Noto Serif KR', serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <button onClick={() => navigate('/')} style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)',
            fontSize: 13, cursor: 'pointer', marginBottom: 16,
          }}>← 홈으로</button>
          <div style={{ fontSize: 11, letterSpacing: 4, color: GOLD, textTransform: 'uppercase', marginBottom: 8 }}>
            사주 부동산 분석
          </div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 900 }}>정보 입력</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 6 }}>
            더 정확한 분석을 위해 모두 입력해주세요
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 24, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          <div>
            <label style={lbl}>이름 *</label>
            <input style={inp} placeholder="이름을 입력하세요"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>생년월일 *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
              <input style={inp} type="number" placeholder="년도 (예: 1985)"
                value={form.birthYear} onChange={e => set('birthYear', e.target.value)} />
              <input style={inp} type="number" placeholder="월"
                value={form.birthMonth} onChange={e => set('birthMonth', e.target.value)} />
              <input style={inp} type="number" placeholder="일"
                value={form.birthDay} onChange={e => set('birthDay', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>태어난 시 (선택)</label>
            <select style={{ ...inp, cursor: 'pointer' }} value={form.birthHour}
              onChange={e => set('birthHour', e.target.value)}>
              {HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>성별 *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: 'male', l: '남성 👨' }, { v: 'female', l: '여성 👩' }].map(g => (
                <button key={g.v} onClick={() => set('gender', g.v)} style={{
                  flex: 1, padding: '13px', borderRadius: 12, border: '1px solid',
                  borderColor: form.gender === g.v ? GOLD : 'rgba(255,255,255,0.12)',
                  background: form.gender === g.v ? `${GOLD}22` : 'transparent',
                  color: form.gender === g.v ? GOLD : 'rgba(255,255,255,0.55)',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                }}>{g.l}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>MBTI *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
              {MBTI_TYPES.map(m => (
                <button key={m} onClick={() => set('mbti', m)} style={{
                  padding: '9px 4px', borderRadius: 10, border: '1px solid',
                  borderColor: form.mbti === m ? GOLD : 'rgba(255,255,255,0.1)',
                  background: form.mbti === m ? `${GOLD}22` : 'rgba(255,255,255,0.03)',
                  color: form.mbti === m ? GOLD : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer', fontSize: 12, fontWeight: form.mbti === m ? 700 : 400,
                  transition: 'all 0.15s',
                }}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>현재 관심 있는 부동산 활동 *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {INTERESTS.map(it => (
                <button key={it.value} onClick={() => set('interest', it.value)} style={{
                  padding: '12px 16px', borderRadius: 12, border: '1px solid', textAlign: 'left',
                  borderColor: form.interest === it.value ? GOLD : 'rgba(255,255,255,0.1)',
                  background: form.interest === it.value ? `${GOLD}18` : 'rgba(255,255,255,0.03)',
                  color: form.interest === it.value ? GOLD : 'rgba(255,255,255,0.55)',
                  cursor: 'pointer', fontSize: 14, fontWeight: form.interest === it.value ? 700 : 400,
                  transition: 'all 0.15s',
                }}>{it.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>현재 거주 지역 (선택)</label>
            <input style={inp} placeholder="예: 서울 마포구, 경기 성남시"
              value={form.currentRegion} onChange={e => set('currentRegion', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>관심 있는 지역 (선택)</label>
            <input style={inp} placeholder="예: 서울 강남구, 경기 판교"
              value={form.targetRegion} onChange={e => set('targetRegion', e.target.value)} />
          </div>
          <motion.button
            whileHover={{ scale: 1​​​​​​​​​​​​​​​​
