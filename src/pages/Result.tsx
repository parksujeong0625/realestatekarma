import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ELEMENT_COLORS } from '../lib/constants'
import type { SajuProfile } from '../lib/saju'

const GOLD = '#d4a853'
const BG = 'linear-gradient(135deg, #0a0a0f 0%, #0f1729 50%, #0a0f1a 100%)'

const INTEREST_LABEL: Record<string, string> = {
  buy: '매수 (구매)', sell: '매도 (판매)',
  move: '이사', invest: '투자', rent: '임대차',
}

function WealthBar({ score }: { score: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>재물운 지수</span>
        <span style={{ color: GOLD, fontWeight: 800, fontSize: 14 }}>{score} / 10</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
          style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${GOLD}, #f0c96a)`,
            boxShadow: `0 0 10px ${GOLD}88`,
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>약함</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>강함</span>
      </div>
    </div>
  )
}

function CompassRose({ best, good, avoid }: { best: string[]; good: string[]; avoid: string[] }) {
  const directions = [
    { label: '북', angle: 0 }, { label: '북동', angle: 45 },
    { label: '동', angle: 90 }, { label: '동남', angle: 135 },
    { label: '남', angle: 180 }, { label: '서남', angle: 225 },
    { label: '서', angle: 270 }, { label: '서북', angle: 315 },
  ]
  const getColor = (label: string) => {
    const match = (list: string[]) => list.some(d => d.includes(label) || label.includes(d.replace(/[()木火土金水]/g,'')))
    if (match(best)) return { fill: '#22c55e', text: '#fff' }
    if (match(good)) return { fill: `${GOLD}cc`, text: '#0a0a0f' }
    if (match(avoid)) return { fill: '#ef4444', text: '#fff' }
    return { fill: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.4)' }
  }
  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', inset: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 28, height: 28, borderRadius: '50%',
        background: `${GOLD}33`, border: `1px solid ${GOLD}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: GOLD,
      }}>🏠</div>
      {directions.map(({ label, angle }) => {
        const rad = (angle - 90) * Math.PI / 180
        const x = 90 + 72 * Math.cos(rad)
        const y = 90 + 72 * Math.sin(rad)
        const c = getColor(label)
        return (
          <motion.div key={label}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + angle / 1000 }}
            style={{
              position: 'absolute', left: x - 18, top: y - 14,
              width: 36, height: 28, borderRadius: 8, background: c.fill,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: c.text,
            }}
          >{label}</motion.div>
        )
      })}
    </div>
  )
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { profile: SajuProfile; form: Record<string, string>; aiAnalysis: string } | null
  const [copied, setCopied] = useState(false)

  useEffect(() => { if (!state) navigate('/analyze') }, [state, navigate])
  if (!state) return null

  const { profile, form, aiAnalysis } = state
  const elData = ELEMENT_COLORS[profile.dominantElement] ?? ELEMENT_COLORS.earth
  const lines: string[] = aiAnalysis?.split('\n').filter((l: string) => l.trim()) ?? []

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopied(true); toast.success('링크 복사됨!')
      setTimeout(() => setCopied(false), 2000)
    } catch { toast.error('복사 실패') }
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '24px 20​​​​​​​​​​​​​​​​
