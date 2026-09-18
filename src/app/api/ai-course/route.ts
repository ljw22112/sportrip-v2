import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key ? key.slice(0, 6) + '...' : 'NONE',
  });
}

export async function POST(req: NextRequest) {
  const { eventTitle, region, venue, date, sport, nearbySpots } = await req.json();

  const spotsText = nearbySpots?.length > 0
    ? nearbySpots.map((s: {name:string;addr:string;type:string}) => `- ${s.name} (${s.type}) : ${s.addr}`).join('\n')
    : '- 정보 없음 (지역 일반 추천)';

  const prompt = `한국 스포츠 관광 여행 플래너로서 아래 대회 참가자를 위한 3일 여행 코스를 JSON으로 작성하세요.

대회: ${eventTitle}
종목: ${sport}
장소: ${region} · ${venue}
날짜: ${date}

주변 관광지 (TourAPI):
${spotsText}

반드시 아래 JSON 구조만 출력하세요. 다른 텍스트 없이:
{
  "intro": "한 줄 코스 소개 (20자 이내)",
  "days": [
    {"label":"전날","time":"여유로운 일정","places":[{"name":"장소명","reason":"이유","duration":"약X시간","tip":"팁","type":"관광지"}]},
    {"label":"대회 당일","time":"경기 전후","places":[...]},
    {"label":"다음날","time":"귀가 전","places":[...]}
  ],
  "tip": "전체 팁 한 줄"
}
규칙: days 반드시 3개 / 각 구간 places 2~3개`;

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return NextResponse.json({ ok: false, error: 'GEMINI_API_KEY 환경변수 없음 — Vercel Settings에서 등록 필요' }, { status: 500 });
  }

  const MODELS = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
  let lastErr = '';

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': GEMINI_KEY,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 1500, temperature: 0.5 },
            }),
          }
        );
        const rawBody = await res.text();
        if (!res.ok) {
          lastErr = `${model}:${res.status}:${rawBody.slice(0, 200)}`;
          if (res.status === 429 || res.status === 503) {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }
          break;
        }
        const data = JSON.parse(rawBody);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!text) { lastErr = `empty response from ${model}`; break; }
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) { lastErr = `no JSON in response: ${text.slice(0,100)}`; break; }
        const course = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ ok: true, course, model });
      } catch (e: any) {
        lastErr = String(e);
      }
    }
  }

  return NextResponse.json({ ok: false, error: lastErr }, { status: 500 });
}
