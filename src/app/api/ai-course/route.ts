import { NextRequest, NextResponse } from 'next/server';
import { SPORTS_15 } from '@/lib/sports';

/* ── Layer 1: 입력 검증 ── */
const VALID_SPORTS  = SPORTS_15.map(s => s.key).filter(k => k !== '전체');
const VALID_REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종',
                       '경기','강원','충북','충남','전북','전남','경북','경남','제주'];

function sanitize(s: string, max: number) {
  return String(s||'').replace(/[`'"\\{}[\]<>]/g,'').trim().slice(0, max);
}

/* ── Layer 2: 응답 구조 검증 ── */
const VALID_TYPES = ['관광지','음식점','숙박','카페','산책','기타'];

interface Place   { name:string; reason:string; duration:string; tip:string; type:string; verified?:boolean; }
interface DayPlan { label:string; time:string; places:Place[]; }
interface Course  { intro:string; days:DayPlan[]; tip:string; }

function validateCourse(c: unknown): Course {
  if (!c || typeof c !== 'object') throw new Error('객체 아님');
  const obj = c as Record<string,unknown>;
  if (typeof obj.intro !== 'string') throw new Error('intro 없음');
  if (typeof obj.tip   !== 'string') throw new Error('tip 없음');
  if (!Array.isArray(obj.days) || obj.days.length < 1) throw new Error('days 없음');

  // days가 3개 미만이면 패딩
  const DAY_LABELS = ['전날','대회 당일','다음날'];
  const DAY_TIMES  = ['여유로운 일정','경기 전후','귀가 전'];
  const days: DayPlan[] = DAY_LABELS.map((label, di) => {
    const d = (obj.days as any[])[di];
    if (!d || typeof d !== 'object') {
      return { label, time: DAY_TIMES[di], places: [{ name:'지역 자유 탐방', reason:'개인 일정에 맞게 자유롭게 탐방하세요.', duration:'자유', tip:'지역 관광안내소 방문 추천', type:'관광지' }] };
    }
    const places: Place[] = Array.isArray(d.places) && d.places.length > 0
      ? (d.places as any[]).slice(0,3).map((p: any) => ({
          name:     String(p.name||'장소').slice(0,50),
          reason:   String(p.reason||'추천 장소입니다.').slice(0,200),
          duration: String(p.duration||'약 1시간').slice(0,20),
          tip:      String(p.tip||'').slice(0,100),
          type:     VALID_TYPES.includes(p.type) ? p.type : '관광지',
        }))
      : [{ name:'지역 자유 탐방', reason:'개인 일정에 맞게 자유롭게 탐방하세요.', duration:'자유', tip:'지역 관광안내소 방문 추천', type:'관광지' }];
    return { label: String(d.label||label), time: String(d.time||DAY_TIMES[di]), places };
  });

  return { intro: String(obj.intro).slice(0,60)||'맞춤 여행 코스', days, tip: String(obj.tip).slice(0,100)||'즐거운 여행 되세요!' };
}

/* ── Layer 3: TourAPI 교차 검증 ── */
interface NearbySpot { name:string; addr:string; type:string; }
function crossVerify(course: Course, nearby: NearbySpot[]): Course {
  if (!nearby.length) return course;
  const names = nearby.map(s => s.name);
  return { ...course, days: course.days.map(day => ({
    ...day,
    places: day.places.map(p => ({
      ...p,
      verified: names.some(n => n.includes(p.name) || p.name.includes(n) || (p.name.length>=4&&n.includes(p.name.slice(0,4)))),
    })),
  }))};
}

/* ── 지역별 기본 코스 (최후 폴백) ── */
function getDefaultCourse(region: string, eventTitle: string, sport: string): Course {
  const REGION_SPOTS: Record<string, {sights:string[];food:string[];cafe:string[]}> = {
    서울:  {sights:['경복궁','남산타워','북촌한옥마을'], food:['광장시장','을지로 노가리골목','삼청동 맛집거리'], cafe:['익선동 카페거리','성수동 카페거리']},
    부산:  {sights:['해운대해수욕장','감천문화마을','광안리'], food:['자갈치시장','국제시장','부평깡통시장'], cafe:['흰여울문화마을','전포동 카페거리']},
    대구:  {sights:['수성못','앞산공원','근대문화골목'], food:['동성로 먹자골목','서문시장','방천시장'], cafe:['삼덕동 카페거리','봉리단길']},
    인천:  {sights:['인천차이나타운','월미도','강화도'], food:['신포국제시장','소래포구','개항로거리'], cafe:['개항동 카페거리']},
    경기:  {sights:['수원화성','에버랜드','가평잣향기푸른숲'], food:['수원왕갈비거리','광명동굴','안양예술공원'], cafe:['분당 카페거리']},
    강원:  {sights:['설악산','남이섬','속초해수욕장'], food:['속초 중앙시장','춘천 닭갈비골목','강릉 중앙시장'], cafe:['안목해변 카페거리','강릉 커피거리']},
    충북:  {sights:['청남대','단양 도담삼봉','법주사'], food:['청주 육거리종합시장','단양 마늘떡볶이골목'], cafe:['청주 성안길']},
    충남:  {sights:['공산성','마곡사','천안 독립기념관'], food:['공주 산성시장','아산 온천거리','천안 호두과자거리'], cafe:['논산 카페거리']},
    전북:  {sights:['전주한옥마을','마이산','변산반도'], food:['전주 남부시장','전주비빔밥거리','군산 근대문화거리'], cafe:['전주 객리단길']},
    전남:  {sights:['순천만국가정원','보성 녹차밭','목포 근대역사거리'], food:['목포 남진식당거리','여수 돌산도','광양 매화마을'], cafe:['여수 낭만포차']},
    경북:  {sights:['경주 불국사','안동 하회마을','포항 호미곶'], food:['경주 황리단길','안동 찜닭골목','영주 풍기온천'], cafe:['경주 교촌마을 카페']},
    경남:  {sights:['통영 케이블카','거제 바람의언덕','남해 독일마을'], food:['통영 중앙시장','마산 창동예술촌','진주 남강유등'], cafe:['통영 동피랑마을']},
    광주:  {sights:['무등산','국립아시아문화전당','양림동역사마을'], food:['양동시장','광주 충장로','상무지구 먹자골목'], cafe:['동명동 카페거리']},
    대전:  {sights:['엑스포과학공원','계족산황톳길','유성온천'], food:['성심당','으능정이거리','대전역 칼국수골목'], cafe:['궁동 카페거리']},
    울산:  {sights:['간절곶','태화강국가정원','반구대암각화'], food:['울산 학성시장','삼산 먹자골목','장생포고래문화특구'], cafe:['삼산동 카페거리']},
    세종:  {sights:['세종호수공원','밀마루전망대','베어트리파크'], food:['조치원 중앙시장','세종 어진동 맛집거리'], cafe:['세종 호수공원 카페']},
    제주:  {sights:['성산일출봉','한라산','협재해수욕장'], food:['동문시장','제주 흑돼지거리','성산 해녀촌'], cafe:['카페 1014','애월 카페거리']},
  };

  const spots = REGION_SPOTS[region] || REGION_SPOTS['서울'];

  return {
    intro: `${region}에서 ${sport} 대회와 함께하는 여행`,
    days: [
      {
        label: '전날',
        time: '여유로운 일정',
        places: [
          { name: spots.sights[0], reason: `${region}을 대표하는 관광 명소로, 대회 전날 가볍게 둘러보기 좋습니다.`, duration: '약 2시간', tip: '오전 방문 시 혼잡도 낮음', type: '관광지' },
          { name: spots.food[0], reason: '지역 특산 음식을 맛볼 수 있는 전통 시장. 대회 전 에너지 충전에 좋습니다.', duration: '약 1시간', tip: '탄수화물 위주 식사로 체력 비축 권장', type: '음식점' },
          { name: spots.sights[1], reason: `${region}의 또 다른 대표 명소. 저녁 산책 코스로 추천합니다.`, duration: '약 1.5시간', tip: '저녁 노을 시간대 방문 추천', type: '관광지' },
        ],
      },
      {
        label: '대회 당일',
        time: '경기 전후',
        places: [
          { name: spots.food[1], reason: '대회 후 허기진 배를 채우기 좋은 지역 맛집 거리. 고단백 식사로 회복에 도움됩니다.', duration: '약 1.5시간', tip: '대회 종료 후 일찍 방문해야 대기 시간 없음', type: '음식점' },
          { name: spots.cafe[0], reason: '대회의 여운을 즐기며 쉬어가기 좋은 카페 거리입니다.', duration: '약 1시간', tip: '커피보다 이온음료나 스무디 추천', type: '카페' },
        ],
      },
      {
        label: '다음날',
        time: '귀가 전',
        places: [
          { name: spots.sights[2] || spots.sights[0], reason: `${region}에서 꼭 가봐야 할 명소. 귀가 전 가볍게 방문하기 좋습니다.`, duration: '약 2시간', tip: '오전 일찍 방문 후 귀가 추천', type: '관광지' },
          { name: spots.food[2] || spots.food[0], reason: '귀가 전 마지막 지역 식사. 여행의 마무리로 제격입니다.', duration: '약 1시간', tip: '지역 특산품 쇼핑도 함께 추천', type: '음식점' },
        ],
      },
    ],
    tip: `${region} 대회 참가 시 대중교통 이용을 추천합니다. 숙소는 대회장 인근으로 예약하세요.`,
  };
}

/* ── Gemini 호출 ── */
async function callGemini(prompt: string): Promise<string> {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY 없음');

  const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.7-flash'];

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 2000, temperature: 0.5,
                responseMimeType: 'application/json' },  // JSON 모드 강제
            }),
          }
        );
        if (res.status === 503 || res.status === 429) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        if (!res.ok) break;
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return text;
      } catch { /* 다음 시도 */ }
    }
  }
  throw new Error('AI 응답 없음');
}

/* ── 핸들러 ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventTitle, region, venue, date, sport } = body;

    // 입력 검증
    if (!eventTitle || !region || !sport) {
      return NextResponse.json({ ok:false, error:'필수 정보 누락' }, { status:400 });
    }
    if (!VALID_REGIONS.includes(region)) {
      return NextResponse.json({ ok:false, error:'허용되지 않은 지역' }, { status:400 });
    }

    const cleanTitle = sanitize(eventTitle, 100);
    const cleanRegion = sanitize(region, 10);
    const cleanVenue = sanitize(venue||'', 100);
    const cleanSport = sanitize(sport, 10);
    const cleanDate = String(date||'').slice(0,10);

    const nearby: NearbySpot[] = Array.isArray(body.nearbySpots)
      ? body.nearbySpots.slice(0,12).map((s:any) => ({
          name: sanitize(String(s.name||''), 50),
          addr: sanitize(String(s.addr||''), 80),
          type: sanitize(String(s.type||''), 10),
        }))
      : [];

    // 서버 필터링 — 카테고리별 상위 2개
    const filtered = nearby.reduce((acc: NearbySpot[], spot) => {
      if (acc.filter(s => s.type === spot.type).length < 2) acc.push(spot);
      return acc;
    }, []);

    const spotsText = filtered.length > 0
      ? filtered.map(s => `- ${s.name} (${s.type})`).join('\n')
      : '- 지역 일반 정보 기반 추천';

    const prompt = `한국 스포츠 관광 여행 플래너로서 아래 대회 참가자를 위한 3일 여행 코스를 JSON으로 작성하세요.

대회: ${cleanTitle}
종목: ${cleanSport}
장소: ${cleanRegion} ${cleanVenue}
날짜: ${cleanDate}

주변 관광지 (TourAPI):
${spotsText}

반드시 아래 JSON 구조만 출력하세요. 다른 텍스트 없이:
{
  "intro": "한 줄 코스 소개 (20자 이내)",
  "days": [
    {
      "label": "전날",
      "time": "여유로운 일정",
      "places": [
        {"name": "장소명", "reason": "추천이유 (50자 이내)", "duration": "약 X시간", "tip": "팁", "type": "관광지"}
      ]
    },
    {"label": "대회 당일", "time": "경기 전후", "places": [...]},
    {"label": "다음날", "time": "귀가 전", "places": [...]}
  ],
  "tip": "전체 팁 한 줄"
}

규칙:
- days는 반드시 3개 (전날/대회 당일/다음날)
- 각 구간 places 2~3개
- TourAPI 목록 장소 우선 사용
- type은 반드시: 관광지, 음식점, 숙박, 카페, 산책 중 하나`;

    let course: Course;

    try {
      const rawText = await callGemini(prompt);
      // JSON 추출 — 여러 패턴 시도
      const jsonMatch = rawText.match(/\{[\s\S]*\}/) || rawText.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]).trim() : rawText.trim();
      const parsed = JSON.parse(jsonStr);
      course = validateCourse(parsed);
    } catch (aiErr) {
      // AI 실패 시 지역별 기본 코스로 폴백
      console.log('AI 실패, 기본 코스 사용:', aiErr);
      course = getDefaultCourse(cleanRegion, cleanTitle, cleanSport);
    }

    course = crossVerify(course, filtered);
    const allPlaces = course.days.flatMap(d => d.places);
    const verifiedCount = allPlaces.filter(p => p.verified).length;

    return NextResponse.json({
      ok: true,
      course,
      source: verifiedCount > 0 ? 'ai+tourapi' : 'ai',
      meta: { nearbySpots: filtered.length, verified: verifiedCount, total: allPlaces.length,
              verifiedRatio: allPlaces.length ? Math.round(verifiedCount/allPlaces.length*100) : 0 },
    });

  } catch (e: any) {
    return NextResponse.json({ ok:false, error:e.message }, { status:500 });
  }
}
