export const config = { runtime: 'edge' }

const INTEREST_KR = {
  buy: '매수(구매) 검토 중',
  sell: '매도(판매) 검토 중',
  move: '이사 계획 중',
  invest: '투자 검토 중',
  rent: '임대차 계약 검토 중',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }
  const {
    name, year, month, day, birthHour, gender, mbti,
    interest, currentRegion, targetRegion,
    dayStem, yearPillar, element, mbtiTitle,
    directionBest, wealthScore,
  } = await req.json()
  const interestKr = INTEREST_KR[interest] || interest
  const prompt = `당신은 사주명리학 전문가이자 부동산 운세 분석가입니다.
아래 정보를 바탕으로 부동산 운세 분석을 해주세요.

[사주 정보]
- 이름: ${name} / 생년월일: ${year}년 ${month}월 ${day}일 / 성별: ${gender === 'male' ? '남' : '여'}
- 태어난 시: ${birthHour === 'unknown' ? '모름' : birthHour + '시'}
- 일간(日干): ${dayStem} / 연주(年柱): ${yearPillar}
- 주도 오행: ${element} / MBTI: ${mbti}(${mbtiTitle})
- 재물운 지수: ${wealthScore}/10
- 현재 관심: ${interestKr}
- 현재 거주 지역: ${currentRegion}
- 관심 지역: ${targetRegion}
- 사주 기반 최적 방위: ${directionBest}

아래 4가지 항목을 각각 이모지 제목 포함, 3~4문장으로 작성해주세요:

1. 🗓️ 2025년 매매·이사 길흉 타이밍
2. 🏠 2026년 부동산 전망
3. 💡 ${name}님에게 맞는 투자·거주 전략
4. ⚠️ 주의사항 & 보완점

총 600자 이내로 작성해주세요.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await res.json()
    const aiAnalysis = data.content?.[0]?.text ?? '분석 결과를 불러오지 못했어요.'
    return new Response(JSON.stringify({ aiAnalysis }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ aiAnalysis: '잠시 후 다시 시도해주세요.' }), { status: 500 })
  }
}
