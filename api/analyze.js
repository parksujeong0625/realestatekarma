export const maxDuration = 30

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ aiAnalysis: 'API 키 없음' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await req.json()
  const { name, year, month, day, gender, mbti, interest, dayStem, element, mbtiTitle, directionBest, wealthScore, currentRegion, targetRegion } = body

  const INTEREST_KR = { buy: '매수', sell: '매도', move: '이사', invest: '투자', rent: '임대차' }

  const prompt = `사주 부동산 운세 분석. 간결하게.
${name}, ${year}년생 ${gender === 'male' ? '남' : '여'}, 일간 ${dayStem}, 오행 ${element}, MBTI ${mbti}(${mbtiTitle}), 재물운 ${wealthScore}/10
관심: ${INTEREST_KR[interest] || interest}, 현재: ${currentRegion}, 목표: ${targetRegion}, 방위: ${directionBest}

4항목 각 2문장:
1. 🗓️ 2025년 길흉 타이밍
2. 🏠 2026년 전망
3. 💡 투자 전략
4. ⚠️ 주의사항`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await response.json()
    const aiAnalysis = data.content?.[0]?.text ?? '분석 결과 없음'
    return new Response(JSON.stringify({ aiAnalysis }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ aiAnalysis: '오류: ' + e.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
