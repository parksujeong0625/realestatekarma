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
    <div style={{ minHeight: '100vh', background: BG, padding: '24px 20px', fontFamily: "'Noto Serif KR', serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => navigate('/analyze')} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.4)', borderRadius: 50, padding: '8px 18px',
            fontSize: 13, cursor: 'pointer', marginBottom: 24,
          }}>← 다시 분석</motion.button>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{
            background: `linear-gradient(135deg, ${elData.bg}18, ${elData.bg}30)`,
            border: `1px solid ${elData.bg}44`, borderRadius: 24,
            padding: '28px 24px', marginBottom: 16, textAlign: 'center',
            boxShadow: `0 8px 48px ${elData.bg}22`,
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${GOLD}18`, border: `1px solid ${GOLD}33`,
            borderRadius: 50, padding: '4px 14px', fontSize: 12, color: GOLD, marginBottom: 14,
          }}>
            {elData.emoji} {elData.name} · {profile.mbtiEmoji} {form.mbti} · {INTEREST_LABEL[form.interest]}
          </div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 4 }}>
            {profile.name}님의 부동산 운세
          </h2>
          <div style={{ color: elData.bg, fontSize: 15, marginBottom: 16 }}>
            일간 {profile.dayStem}일 · {profile.yearPillar.stem}{profile.yearPillar.branch}년생 · {profile.mbtiTitle}
          </div>
          <WealthBar score={profile.wealthScore} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20, padding: '24px', marginBottom: 16,
          }}
        >
          <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 800, marginBottom: 20 }}>🧭 나에게 맞는 방위</h3>
          <CompassRose best={profile.directionData.best} good={profile.directionData.good} avoid={profile.directionData.avoid} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
            {[
              { color: '#22c55e', label: `최적: ${profile.directionData.best.join(' · ')}` },
              { color: GOLD, label: `좋음: ${profile.directionData.good.join(' · ')}` },
              { color: '#ef4444', label: `피함: ${profile.directionData.avoid.join(' · ')}` },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20, padding: '22px', marginBottom: 16,
          }}
        >
          <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🗺️ 오행으로 보는 맞는 지역·주거</h3>
          {[
            { icon: '📍', label: '맞는 지역', value: profile.directionData.region },
            { icon: '🌆', label: '지역 성향', value: profile.directionData.regionDesc },
            { icon: '🏠', label: '추천 주거 유형', value: profile.directionData.houseType },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '12px 0',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 3 }}>{item.label}</div>
                <div style={{ color: '#fff', fontSize: 14, lineHeight: 1.5 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20, padding: '22px', marginBottom: 16,
          }}
        >
          <h3 style={{ color: GOLD, fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🔮 AI 사주 부동산 분석</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lines.length > 0 ? lines.map((line, i) => {
              const isHeader = /^[0-9]+\.|^[🏠💸📦📈🔑🗓️📅⚠️✅🌟💡🔮]/.test(line)
              return (
                <div key={i} style={{
                  background: isHeader ? `${GOLD}10` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isHeader ? GOLD + '22' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 12, padding: '12px 14px',
                  color: isHeader ? GOLD : 'rgba(255,255,255,0.8)',
                  fontSize: isHeader ? 14 : 13.5, fontWeight: isHeader ? 700 : 400, lineHeight: 1.75,
                }}>{line}</div>
              )
            }) : <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>분석 결과가 없어요.</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 16,
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, lineHeight: 1.7 }}>
            ⚠️ 본 분석은 사주명리학과 MBTI를 기반으로 한 참고용 콘텐츠입니다. 실제 부동산 거래·투자 결정은 전문가와 상담하세요.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          style={{ display: 'flex', gap: 10, marginBottom: 48 }}
        >
          <button onClick={() => navigate('/analyze')} style={{
            flex: 1, padding: '15px', borderRadius: 50,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700,
          }}>🔄 재분석</button>
          <button onClick={handleCopy} style={{
            flex: 1, padding: '15px', borderRadius: 50,
            background: copied ? 'rgba(34,197,94,0.2)' : `${GOLD}22`,
            border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : GOLD + '44'}`,
            color: copied ? '#86efac' : GOLD,
            cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
          }}>{copied ? '✅ 복사됨!' : '🔗 공유'}</button>
        </motion.div>
      </div>
    </div>
  )
}
