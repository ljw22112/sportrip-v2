import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { eventTitle, region, venue, date, sport, nearbySpots, userPrompt } = await req.json();

  const prompt = `당신은 한국 스포츠 관광 전문 여행 플래너입니다.

아래 스포츠 대회 정보를 바탕으로 참가자를 위한 맞춤 여행 코스를 JSON 형식으로 작성해주세요.

## 대회 정보
- 대회명: ${eventTitle}
- 종목: ${sport}
- 개최지: ${region} · ${venue}
- 날짜: ${date}

## 근처 관광 정보 (TourAPI 제공)
${nearbySpots?.length > 0 
  ? nearbySpots.map((s: {name:string;addr:string;type:string}) => `- ${s.name} (${s.type}) : ${s.addr}`).join('\n')
  : '- 정보 없음 (지역 일반 추천으로 대체)'}
${userPrompt?.trim() ? `
## 사용자 추가 요청사항 (최우선 반영)
${userPrompt.trim()}
` : ''}
## 작성 규칙
1. 총 3개 구간: "전날", "대회 당일 (경기 전·후)", "다음날"
2. 각 구간마다 2~3개 장소 추천
3. 각 장소는 이름, 추천 이유 (1~2문장), 예상 소요 시간, 팁을 포함
4. 스포츠 참가자 특성 반영 (체력 회복, 단백질 식사, 스트레칭 공간 등)
5. 가족 동반 참가자도 배려
${userPrompt?.trim() ? '6. 위 "사용자 추가 요청사항"을 다른 규칙보다 우선해서 코스에 반영' : ''}

다음 JSON 구조로만 응답하세요 (다른 텍스트 없이):
{
  "intro": "한 문장 코스 소개 (30자 이내)",
  "days": [
    {
      "label": "전날",
      "time": "여유로운 일정",
      "places": [
        {
          "name": "장소명",
          "reason": "추천 이유 (1~2문장)",
          "duration": "약 X시간",
          "tip": "방문 팁 한 줄",
          "type": "관광지|음식점|숙박|카페|산책"
        }
      ]
    },
    {
      "label": "대회 당일",
      "time": "경기 전후",
      "places": [...]
    },
    {
      "label": "다음날",
      "time": "귀가 전",
      "places": [...]
    }
  ],
  "tip": "전체 여행 핵심 팁 한 줄"
}`;

  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY || '',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 3000,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API 오류 (${res.status}): ${errBody}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // JSON 파싱
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON 파싱 실패: ' + text.slice(0, 200));
    const course = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ ok: true, course });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}