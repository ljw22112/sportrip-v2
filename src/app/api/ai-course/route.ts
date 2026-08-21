import { NextRequest, NextResponse } from 'next/server';
import { SPORTS_15 } from '@/lib/sports';

/* ── Layer 1: 입력 검증 ── */
const VALID_SPORTS  = SPORTS_15.map(s => s.key).filter(k => k !== '전체');
const VALID_REGIONS = ['서울','부산','대구','인천','광주','대전','울산','세종',
                       '경기','강원','충북','충남','전북','전남','경북','경남','제주'];
const MAX_LEN = { title:100, venue:100, region:10, sport:10 };

function sanitize(s: string, max: number) {
  return s.replace(/[`'"\\{}[\]<>]/g,'').trim().slice(0, max);
}

function validateInput(body: Record<string,unknown>): string | null {
  const { eventTitle, region, venue, sport } = body;
  if (typeof eventTitle !== 'string' || !eventTitle) return '대회명 누락';
  if (typeof region     !== 'string' || !region)     return '지역 누락';
  if (typeof venue      !== 'string' || !venue)       return '장소 누락';
  if (typeof sport      !== 'string' || !sport)       return '종목 누락';
  if (eventTitle.length > MAX_LEN.title)              return '대회명 초과';
  if (!VALID_REGIONS.includes(region))                return `허용되지 않은 지역: ${region}`;
  if (!VALID_SPORTS.includes(sport))                  return `허용되지 않은 종목: ${sport}`;
  return null;
}

/* ── Layer 2: 응답 구조 검증 ── */
const VALID_TYPES = ['관광지','음식점','숙박','카페','산책','기타'];

interface Place   { name:string; reason:string; duration:string; tip:string; type:string; verified?:boolean; }
interface DayPlan { label:string; time:string; places:Place[]; }
interface Course  { intro:string; days:DayPlan[]; tip:string; }

function validateCourse(c: unknown): Course {
  if (!c || typeof c !== 'object') throw new Error('응답이 객체가 아님');
  const obj = c as Record<string,unknown>;
  if (typeof obj.intro !== 'string' || obj.intro.length < 2) throw new Error('intro 오류');
  if (typeof obj.tip   !== 'string' || obj.tip.length   < 2) throw new Error('tip 오류');
  if (!Array.isArray(obj.days) || obj.days.length !== 3)     throw new Error('days 3개 필요');

  const days: DayPlan[] = (obj.days as unknown[]).map((d:unknown, di:number) => {
    if (!d || typeof d !== 'object') throw new Error(`day[${di}] 오류`);
    const day = d as Record<string,unknown>;
    if (!Array.isArray(day.places) || day.places.length < 1) throw new Error(`day[${di}].places 오류`);
    const places: Place[] = (day.places as unknown[]).map((p:unknown, pi:number) => {
      if (!p || typeof p !== 'object') throw new Error(`place[${di}][${pi}] 오류`);
      const pl = p as Record<string,unknown>;
      if (typeof pl.name   !== 'string' || pl.name.length < 2) throw new Error(`place.name 오류`);
      if (typeof pl.reason !== 'string' || pl.reason.length < 4) throw new Error(`place.reason 오류`);
      const type = typeof pl.type === 'string' && VALID_TYPES.includes(pl.type) ? pl.type : '기타';
      return {
        name:     String(pl.name).slice(0,50),
        reason:   String(pl.reason).slice(0,200),
        duration: typeof pl.duration === 'string' ? pl.duration.slice(0,20) : '약 1시간',
        tip:      typeof pl.tip === 'string' ? String(pl.tip).slice(0,100) : '',
        type,
      };
    });
    return { label:String(day.label||''), time:String(day.time||''), places };
  });

  return { intro:String(obj.intro).slice(0,60), days, tip:String(obj.tip).slice(0,100) };
}

/* ── Layer 3: TourAPI 교차 검증 ── */
interface NearbySpot { name:string; addr:string; type:string; }

function crossVerify(course: Course, nearby: NearbySpot[]): Course {
  if (!nearby.length) return course;
  const names = nearby.map(s => s.name);
  return {
    ...course,
    days: course.days.map(day => ({
      ...day,
      places: day.places.map(place => ({
        ...place,
        verified: names.some(n =>
          n.includes(place.name) || place.name.includes(n) ||
          (place.name.length >= 4 && n.includes(place.name.slice(0,4)))
        ),
      })),
    })),
  };
}

/* ── 핸들러 ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Layer 1
    const inputErr = validateInput(body);
    if (inputErr) return NextResponse.json({ ok:false, error:inputErr }, { status:400 });

    const eventTitle  = sanitize(body.eventTitle,  MAX_LEN.title);
    const region      = sanitize(body.region,       MAX_LEN.region);
    const venue       = sanitize(body.venue,        MAX_LEN.venue);
    const sport       = sanitize(body.sport,        MAX_LEN.sport);
    const date        = typeof body.date === 'string' ? body.date.slice(0,10) : '';
    const nearby: NearbySpot[] = Array.isArray(body.nearbySpots)
      ? body.nearbySpots.slice(0,20).map((s:unknown) => {
          const sp = s as Record<string,unknown>;
          return { name:sanitize(String(sp.name||''),50), addr:sanitize(String(sp.addr||''),80), type:sanitize(String(sp.type||''),10) };
        })
      : [];

    // 서버 사전 필터링 — 카테고리별 상위 2개만 추림
    const filtered = nearby.reduce((acc, spot) => {
      const count = acc.filter(s => s.type === spot.type).length;
      if (count < 2) acc.push(spot);
      return acc;
    }, [] as NearbySpot[]).slice(0, 8);

    const spotsText = filtered.length > 0
      ? filtered.map(s => `- ${s.name} (${s.type})`).join('\n')
      : '- 지역 일반 추천';

    const prompt = `한국 스포츠 관광 여행 플래너.

아래 대회 정보를 바탕으로 참가자를 위한 맞춤 여행 코스를 JSON으로 작성하세요.

대회명: ${eventTitle}
종목: ${sport}
개최지: ${region} · ${venue}
날짜: ${date}

TourAPI 주변 관광 정보:
${spotsText}

규칙:
1. days 3개 고정: "전날"/"대회 당일"/"다음날"
2. 각 구간 places 2개
3. 위 TourAPI 목록 장소 그대로 사용 (장소 임의 생성 금지)
4. reason/tip은 짧게 (각 50자 이내)

JSON만 출력:
{"intro":"30자 이내 소개","days":[{"label":"전날","time":"여유로운 일정","places":[{"name":"장소명","reason":"추천이유","duration":"약 X시간","tip":"팁","type":"관광지|음식점|숙박|카페|산책"}]},{"label":"대회 당일","time":"경기 전후","places":[...]},{"label":"다음날","time":"귀가 전","places":[...]}],"tip":"핵심 팁 한줄"}`;

    // Gemini API 호출 — 모델 폴백 + 재시도
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY 환경변수 없음');

    const MODELS = ['gemini-3.7-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    let rawText = '';
    let lastErr = '';

    for (const model of MODELS) {
      let success = false;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const aiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
              }),
            }
          );
          if (aiRes.status === 503 || aiRes.status === 429) {
            lastErr = `${model}: ${aiRes.status}`;
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            continue;
          }
          if (!aiRes.ok) {
            const err = await aiRes.text();
            lastErr = `${model}: ${aiRes.status} ${err.slice(0,80)}`;
            break;
          }
          const aiData = await aiRes.json();
          rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          success = true;
          break;
        } catch (e) {
          lastErr = String(e);
        }
      }
      if (success) break;
    }

    if (!rawText) throw new Error(`모든 모델 실패: ${lastErr}`);

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON 파싱 실패');
    const parsed = JSON.parse(jsonMatch[0]);

    // Layer 2
    const validated = validateCourse(parsed);

    // Layer 3
    const course = crossVerify(validated, nearby);
    const allPlaces = course.days.flatMap(d => d.places);
    const verifiedCount = allPlaces.filter(p => p.verified).length;

    return NextResponse.json({
      ok: true,
      course,
      meta: { nearbySpots:nearby.length, verified:verifiedCount, total:allPlaces.length,
              verifiedRatio: allPlaces.length ? Math.round(verifiedCount/allPlaces.length*100) : 0 },
    });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[ai-course]', msg);
    return NextResponse.json({ ok:false, error:msg }, { status:500 });
  }
}
