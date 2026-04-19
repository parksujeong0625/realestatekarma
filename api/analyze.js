export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ aiAnalysis: 'API 키가 설정되지 않았어요.' })
  }

  const {
    name, year, month, day, birthHour, gender, mbti,
    interest, currentRegion, targetRegion,
    dayStem, yearPillar, element, mbtiTitle,
    directionBest, wealthScore,
  } = req.body

  const INTEREST_KR = {
    buy: '매수(구매)', sell: '매도(판매)',
    move: '이사', invest: '투자', rent: '임대차',
  }

  const prompt = `당신은 사주명리학 전문가이자 부동산 운세 분석가입니다.

[사주 정보]
- 이름: ${name} / 생년월일: ${year}년 ${month}월 ${day}일 / 성별: ${gender === 'male' ? '남' : '여'}
- 태어난 시: ${birthHour === 'unknown' ? '모름' : birthHour + '시'}
- 일간: ${dayStem} / 연주: ${yearPillar}
- 주도 오행: ${element} / MBTI: ${mbti}(${mbtiTitle})
- 재물운: ${wealthScore}/10 / 관심: ${INTEREST_KR[interest] || interest}
- 현재 지역: ${currentRegion} / 관심 지역: ${targetRegion}
- 최적 방위: ${directionBest}

아래 4가지를 이모지 포함해 작성해주세요:
1. 🗓️ 2025년 매매·이사 길흉 타이밍
2. 🏠 2026년 부동산 전망
3. 💡 맞는 투자·거주 전략
4. ⚠️ 주의사항

600자 이내로 작성해주세요.`

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
    return res.status(200).json({ aiAnalysis })
  } catch (e) {
    return res.status(500).json({ aiAnalysis: '잠시 후 다시 시도해주세요.' })
  }
}
