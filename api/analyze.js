export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ aiAnalysis: 'API 키가 없어요.' }), { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ aiAnalysis: '요청 파싱 실패' }), { status: 400 })
  }

  const {
    name, year, month, day, birthHour, gender, mbti,
    interest, currentRegion, targetRegion,
    dayStem, yearPillar, element, mbtiTitle,
    directionBest, wealthScore,
  } = body

  const INTEREST_KR = {
    buy: '매수', sell: '매도', move: '이사', invest: '투자', rent: '임대차',
  }

  const prompt = `사주명리학 전문가로서 부동산 운세를 분석해주세요.

이름: ${name}, 생년월일: ${year}년 ${month}월 ${day}일, 성별: ${gender === 'male' ? '남' : '여'}
태어난 시: ${birthHour === 'unknown' ? '모름' : birthHour}, 일간: ${dayStem}, 연주: ${yearPillar}
주도 오행: ${element}, MBTI: ${mbti}(${mbtiTitle}), 재물운: ${wealthScore}/10
관심: ${INTEREST_KR[interest] || interest}, 현재지역: ${currentRegion}, 관심지역: ${targetRegion}, 최적방위: ${directionBest}

4가지 항목을 이모지 포함해 작성:
1. 🗓️ 2025년 매매·이사 길흉 타이밍 (좋은 달/나쁜 달 명시)
2. 🏠 2026년 부동산 전망
3. 💡 맞는 투자·거주 전략
4. ⚠️ 주의사항

600자 이내.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
    const data = await response.json()
    const aiAnalysis = data.content?.[0]?.text ?? '분석 결과를 불러오지 못했어요.'
    return new Response(JSON.stringify({ aiAnalysis }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ aiAnalysis: '잠시 후 다시 시도해주세요.' }), { status: 500 })
  }
}
