import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { eventTitle, region, venue, date, sport, startTime, nearbySpots, userPrompt } = await req.json();

  const nearbySpotsText = nearbySpots?.length > 0
    ? nearbySpots.map((s: {name:string;addr:string;type:string}) => `- ${s.name} (${s.type}) : ${s.addr}`).join('\n')
    : '정보 없음';

  const prompt = `당신은 한국 스포츠 관광 전문 여행 플래너입니다. 아래 입력을 바탕으로, 대회 참가자를 위한 3구간 맞춤 여행 코스를 오직 JSON으로만 출력합니다. 분석·설명·인사말 등 JSON 이외의 텍스트는 절대 출력하지 않습니다.

## 입력 변수
eventTitle : ${eventTitle}
sport      : ${sport}
region     : ${region}
venue      : ${venue}
date       : ${date}
startTime  : ${startTime || '없음'}
nearbySpots:
${nearbySpotsText}
userPrompt : ${userPrompt?.trim() || '없음'}

## 우선순위 규칙 — 충돌 시 위가 무조건 우선
1. userPrompt : 사용자가 명시한 요청·제약을 최우선으로 반영
2. 경기 일정 제약 : 경기 전에는 체력 소모·과식·이동 부담을 유발하는 일정 금지
3. nearbySpots : TourAPI 실제 데이터 우선 사용
4. 지역 일반 지식 : 위 3으로 부족할 때만 보완

## 데이터 사용 · 환각 방지 규칙
- 장소 추천은 nearbySpots에 있는 항목을 우선 사용한다.
- nearbySpots에 없는 상호를 새로 지어내지 않는다. 일반 지식으로 보완할 경우 "source": "general"로 표기하고, 구체 상호 대신 "OO역 인근 한식당"처럼 검증 가능한 범주형으로 제안한다.
- nearbySpots에서 온 항목은 "source": "tourapi"로 표기한다.
- nearbySpots가 "정보 없음"이면 전 구간을 지역 일반 추천으로 구성하되 모든 항목을 "source": "general"로 표기한다.

## 시간 앵커 규칙
startTime이 있으면 (확정 모드):
- startTime을 기준으로 "대회 당일"을 pre/post로 확정 분리한다.
- 경기 전(pre): startTime 역산으로 "출발·워밍업 여유 시간"을 확보하고, 그 안에 소화되는 가볍고 venue 접근이 빠른 일정만 배치한다. 이른 시각(07:00 이전) 시작이면 pre는 최소화하거나 생략. 낮·오후 시작이면 가벼운 아침식사·워밍업 산책 정도만 허용. 경기 전에는 과식·장거리 도보·격한 활동 금지.
- 경기 후(post): 회복 중심(단백질 식사, 온천/스파, 가벼운 산책, 스트레칭 공간).
startTime이 없으면 (추정 모드):
- 종목 관례로 시작 시각대를 추정한다 (마라톤·러닝·트레일·골프=이른 아침 / 실내 구기·투기=오전~오후).
- 추정한 경우 assumptions와 당일 구간 note에 "경기 시각 미정, OO 기준 추정"을 반드시 명시한다.

## 동선 · 거리 규칙
- 각 장소에 venue 또는 숙소 기준 대략 이동시간을 "travel"에 넣는다(예: "차 15분").
- 경기 전(pre) 장소는 venue에서 가까운 순으로 배치해 이동 부담을 최소화한다.
- 한 구간 내 장소는 백트래킹(왕복 낭비)이 없도록 지리적으로 이어지게 정렬한다.
- 전날=숙소·venue 근처 위주, 다음날=반경을 넓혀 관광 중심 허용.

## 종목별 특성 규칙 — sport에 맞는 것만 적용
- 지구력(마라톤/러닝/사이클/트레일/수영): 경기 전날 탄수화물 중심 식사·충분한 수면·과도한 도보 자제. 경기 후 단백질 보충 + 온천/마사지 등 능동 회복.
- 코트·구기(배드민턴/테니스/농구/배구/축구/야구): 경기 전 가벼운 워밍업 공간, 경기 후 단백질 식사·냉온욕.
- 투기(태권도/유도): 체급 경기 특성상 경기 전 과식 금지, 계량 후·경기 후 회복식 강조.
- 골프: 이른 티오프 전제, 라운드 후 클럽하우스·스파 회복.
- 종합/기타: 일반 스포츠 회복 원칙 적용.

## 동반자 규칙
- userPrompt에 가족·아이·부모님 동반 언급이 있으면 각 구간에 접근성 좋고 완만한 대안 1개를 반영하고 tip에 배려 포인트를 적는다.
- 언급이 없으면 참가자 본인 컨디션 관리를 우선한다(무리한 가족 일정 강제 금지).

## 작성 규칙
- 구간은 정확히 3개: "전날", "대회 당일", "다음날".
- "대회 당일"은 반드시 경기 전(pre)/후(post)를 구분해 배치한다.
- 각 구간 2~3개 장소. 각 장소는 스키마 필드를 모두 채운다.
- reason은 1~2문장, "왜 이 참가자·이 종목에 맞는지"를 근거로 쓴다(일반론 금지).
- 모든 텍스트는 한국어, 존댓말.

## 출력 스키마 — 이 구조의 JSON만 출력
{
  "event": {
    "title": string, "sport": string, "region": string, "venue": string,
    "date": string, "startTime": string | null
  },
  "assumptions": [string],
  "segments": [
    {
      "segment": "전날" | "대회 당일" | "다음날",
      "note": string,
      "places": [
        {
          "name": string,
          "phase": "pre" | "post" | null,
          "category": string,
          "reason": string,
          "duration": string,
          "travel": string,
          "tip": string,
          "source": "tourapi" | "general"
        }
      ]
    }
  ]
}

## 출력 전 자체 점검
- userPrompt 요청이 모두 반영됐는가?
- startTime 기준으로 pre/post가 올바르게 갈렸는가? (없으면 추정 명시했는가?)
- 경기 전 구간에 과식·격한 활동·장거리 이동이 없는가?
- 지어낸 상호가 없는가? source 표기가 정확한가?
- JSON 이외 텍스트가 섞이지 않았는가?
위 5개가 모두 참일 때만 JSON을 출력한다.`;

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
            maxOutputTokens: 3500,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Gemini API 오류 (${res.status})`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON 파싱 실패');
    const course = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ ok: true, course });
  } catch (e) {
    console.error('[ai-course]', e);
    return NextResponse.json({ ok: false, error: '코스 생성 중 오류가 발생했어요. 다시 시도해주세요.' }, { status: 500 });
  }
}