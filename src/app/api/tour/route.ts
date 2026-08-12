/**
 * TourAPI 프록시 라우트
 * 위치기반관광정보조회 (한국관광공사)
 * GET /api/tour?lat=37.5&lng=126.9&type=12
 *
 * contentTypeId:
 *  12=관광지  14=문화시설  15=행사/축제  32=숙박  39=음식점
 */
import { NextRequest, NextResponse } from 'next/server';

const SERVICE_KEY = process.env.TOUR_API_KEY || '';
const BASE_URL    = 'https://apis.data.go.kr/B551011/KorService1/locationBasedList1';
const RADIUS      = 10000; // 반경 10km

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat         = searchParams.get('lat');
  const lng         = searchParams.get('lng');
  const type        = searchParams.get('type') || '12';
  const barrierFree = searchParams.get('barrierFree') === '1';

  if (!lat || !lng) {
    return NextResponse.json({ error: '위도·경도 필요' }, { status: 400 });
  }

  if (!SERVICE_KEY) {
    return NextResponse.json({ error: 'TOUR_API_KEY 미설정', items: [] }, { status: 200 });
  }

  try {
    const params = new URLSearchParams({
      serviceKey:    SERVICE_KEY,
      numOfRows:     '6',
      pageNo:        '1',
      MobileOS:      'ETC',
      MobileApp:     'SpoTrip',
      _type:         'json',
      contentTypeId: type,
      mapX:          lng,
      mapY:          lat,
      radius:        String(RADIUS),
      arrange:       'E', // 거리순
    });

    const res = await fetch(`${BASE_URL}?${params}`, {
      cache: 'no-store', // 실시간 호출 필수 (공모전 규정)
    });

    if (!res.ok) throw new Error(`TourAPI HTTP ${res.status}`);

    const json = await res.json();
    const header = json?.response?.header;

    if (header?.resultCode !== '0000') {
      throw new Error(`TourAPI 오류: ${header?.resultMsg}`);
    }

    const raw   = json?.response?.body?.items?.item ?? [];
    const items = Array.isArray(raw) ? raw : (raw ? [raw] : []);

    // 필요한 필드만 추출
    const result = items.map((item: any) => ({
      name:  item.title        || '',
      addr:  item.addr1        || '',
      tel:   item.tel          || '',
      dist:  item.dist         || 0,
      img:   item.firstimage   || '',
      url:   item.homepage     || '',
      desc:  item.overview     || '',
    }));

    return NextResponse.json({ items: result, source: 'tourapi' }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });

  } catch (err: any) {
    console.error('TourAPI 오류:', err.message);
    return NextResponse.json({ items: [], error: err.message, source: 'error' }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}
