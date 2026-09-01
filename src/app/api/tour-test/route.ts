import { NextResponse } from 'next/server';

export async function GET() {
  const KEY = process.env.TOUR_API_KEY || '';
  const lat = '35.8571', lng = '128.6014'; // 대구 테스트

  const params = new URLSearchParams({
    numOfRows: '3', pageNo: '1',
    MobileOS: 'ETC', MobileApp: 'SpoTrip',
    _type: 'json', contentTypeId: '12',
    mapX: lng, mapY: lat, radius: '5000', arrange: 'E',
  });

  const reqUrl = `https://apis.data.go.kr/B551011/KorService2/locationBasedList2?serviceKey=${encodeURIComponent(KEY)}&${params}`;

  try {
    const res = await fetch(reqUrl, { cache: 'no-store' });
    const text = await res.text();
    return NextResponse.json({
      status: res.status,
      keyLength: KEY.length,
      keyPrefix: KEY.slice(0, 10) + '...',
      url: reqUrl.slice(0, 120) + '...',
      response: text.slice(0, 500),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
