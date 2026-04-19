export const maxDuration = 30

export default async function handler(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  
  if (!apiKey) {
    return new Response(JSON.stringify({ aiAnalysis: '키 없음' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ aiAnalysis: `키 확인됨: ${apiKey.substring(0, 15)}...` }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
