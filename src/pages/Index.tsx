import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const GOLD = '#d4a853'
const GOLD2 = '#f0c96a'
const BG = 'linear-gradient(135deg, #0a0a0f 0%, #0f1729 50%, #0a0f1a 100%)'

const features = [
  { icon: '🏠', title: '매매 타이밍', desc: '올해·내년 매수/매도 길흉월 분석' },
  { icon: '🧭', title: '방위 분석', desc: '나에게 맞는 방향·채광·위치' },
  { icon: '🗺️', title: '지역 성향', desc: '오행으로 보는 맞는 지역·환경' },
  { icon: '💰', title: '재물운 점수', desc: '사주 기반 부동산 재물운 지수' },
]

export default function Index() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', background: BG,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '32px 20px', position: 'relative', overflow: 'hidden',
      fontFamily: "'Noto Serif KR', serif",
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(212,168,83,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.8) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
        style={{ maxWidth: 480, width: '100%', textAlign: 'center', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: `1px solid ${GOLD}44`, borderRadius: 50,
            padding: '6px 18px', marginBottom: 28, background: `${GOLD}11`,
          }}
        >
          <span style={{ fontSize: 12 }}>✨</span>
          <span style={{ color: GOLD, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' }}>
            사주 × 부동산 운 분석
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            fontSize: 42, fontWeight: 900, lineHeight: 1.2, marginBottom: 16,
            background: `linear-gradient(135deg, ${GOLD2}, ${GOLD}, #fff)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          내 사주로 보는<br />부동산 운세
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}
        >
          매매·이사 타이밍부터 나에게 맞는 방위·지역까지<br />
          사주팔자 + MBTI로 AI가 분석해드려요
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}
        >
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '18px 14px', textAlign: 'left',
            }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ color: GOLD, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03, boxShadow: `0 8px 40px ${GOLD}44` }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/analyze')}
          style={{
            width: '100%', padding: '18px', borderRadius: 50,
            background: `linear-gradient(135deg, ${GOLD}, #b8860b)`,
            border: 'none', color: '#0a0a0f', fontSize: 17, fontWeight: 900,
            cursor: 'pointer', letterSpacing: 1, boxShadow: `0 4px 20px ${GOLD}33`,
          }}
        >
          🔮 무료로 분석 시작하기
        </motion.button>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 16 }}>
          생년월일 · MBTI 입력만으로 AI 즉시 분석
        </p>
      </motion.div>
    </div>
  )
}
