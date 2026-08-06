import {notFound} from 'next/navigation';
import Link from 'next/link';
import {EVENTS,calcDday} from '@/lib/data';
import {MapPin,Calendar,Users,ExternalLink,Share2,ArrowLeft,Globe} from 'lucide-react';
import {cn} from '@/lib/utils';
import {CourseSection} from '@/components/events/CourseSection';

interface Props{params:Promise<{id:string}>}
export async function generateStaticParams(){return EVENTS.map(e=>({id:String(e.id)}))}
export async function generateMetadata({params}:Props){
  const{id}=await params;const ev=EVENTS.find(e=>e.id===Number(id));
  if(!ev)return{title:'대회를 찾을 수 없습니다'};
  return{title:`${ev.title} — 스포트립`,description:ev.desc};
}

const S_STYLE={upcoming:'bg-[#E8F5E9] text-[#2E7D32]',ongoing:'bg-[#FFF3E0] text-[#E65100]',done:'bg-[#F5F5F5] text-[#9E9E9E]'};
const S_LABEL={upcoming:'예정',ongoing:'진행중',done:'종료'};

const VISITKOREA:Record<string,string>={
  '서울':'https://korean.visitkorea.or.kr/main/area.do#11','부산':'https://korean.visitkorea.or.kr/main/area.do#26',
  '대구':'https://korean.visitkorea.or.kr/main/area.do#27','인천':'https://korean.visitkorea.or.kr/main/area.do#28',
  '광주':'https://korean.visitkorea.or.kr/main/area.do#29','대전':'https://korean.visitkorea.or.kr/main/area.do#30',
  '울산':'https://korean.visitkorea.or.kr/main/area.do#31','세종':'https://korean.visitkorea.or.kr/main/area.do#36',
  '경기':'https://korean.visitkorea.or.kr/main/area.do#41','강원':'https://korean.visitkorea.or.kr/main/area.do#51',
  '충북':'https://korean.visitkorea.or.kr/main/area.do#43','충남':'https://korean.visitkorea.or.kr/main/area.do#44',
  '전북':'https://korean.visitkorea.or.kr/main/area.do#45','전남':'https://korean.visitkorea.or.kr/main/area.do#46',
  '경북':'https://korean.visitkorea.or.kr/main/area.do#47','경남':'https://korean.visitkorea.or.kr/main/area.do#48',
  '제주':'https://korean.visitkorea.or.kr/main/area.do#50',
};

export default async function EventDetailPage({params}:Props){
  const{id}=await params;
  const ev=EVENTS.find(e=>e.id===Number(id));
  if(!ev)notFound();
  const dday=calcDday(ev.start);
  const isDone=ev.status==='done';
  const visitUrl=VISITKOREA[ev.region]||'https://korean.visitkorea.or.kr';
  const related=EVENTS.filter(e=>e.id!==ev.id&&(e.region===ev.region||e.sport===ev.sport)&&e.status!=='done').slice(0,4);

  return(
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-[#717171] hover:text-[#222222] mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4"/>검색 결과로 돌아가기
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#222222] mb-2">{ev.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#717171]">
          <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold',S_STYLE[ev.status])}>{S_LABEL[ev.status]}</span>
          <span>⭐ {ev.sport}</span><span>📍 {ev.region}</span>
          {ev.participants&&<span>👥 {ev.participants}</span>}
          {!isDone&&<span className="font-semibold text-[#FF5722]">{dday}</span>}
        </div>
      </div>

      {/* 이미지 히어로 */}
      <div className="rounded-2xl overflow-hidden mb-8 grid grid-cols-4 grid-rows-2 gap-2 h-[280px] md:h-[420px]">
        <div className="col-span-2 row-span-2 bg-gradient-to-br from-[#1B4F72] to-[#154360] flex items-center justify-center text-8xl md:text-9xl">{ev.icon}</div>
        {['🏟️','🗺️','📸','🎉'].map((ico,i)=>(
          <div key={i} className={cn('flex items-center justify-center text-3xl md:text-5xl',
            ['from-[#2980B9] to-[#1B4F72]','from-[#FF7043] to-[#FF5722]','from-[#43A047] to-[#2E7D32]','from-[#7B1FA2] to-[#4A148C]'][i],
            'bg-gradient-to-br')}>{ico}</div>
        ))}
      </div>

      {/* 2단 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div>
          {/* 대회 정보 */}
          <div className="pb-8 border-b border-[#EBEBEB]">
            {ev.distances&&(
              <div className="flex flex-wrap gap-2 mb-3">
                {ev.distances.split('·').map(d=><span key={d} className="text-sm bg-[#F7F7F7] text-[#717171] px-3 py-1 rounded-full border border-[#EBEBEB]">{d.trim()}</span>)}
              </div>
            )}
            <p className="text-[#717171] leading-relaxed mb-4">{ev.desc}</p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#FF5722] mt-0.5 flex-shrink-0"/><div><div className="font-medium text-[#222222]">{ev.venue}</div><div className="text-sm text-[#717171]">{ev.address}</div></div></div>
              <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-[#FF5722] flex-shrink-0"/><span className="font-mono text-[#222222]">{ev.start} ~ {ev.end}</span></div>
              {ev.participants&&<div className="flex items-center gap-3"><Users className="w-5 h-5 text-[#FF5722] flex-shrink-0"/><span className="text-[#222222]">참가 규모: {ev.participants}</span></div>}
            </div>
          </div>

          {/* 관광코스 추천 (CourseSection) */}
          <div className="py-8 border-b border-[#EBEBEB]">
            <CourseSection region={ev.region} eventStart={ev.start} eventEnd={ev.end}/>
          </div>

          {/* visitkorea 연계 */}
          <div className="py-8 border-b border-[#EBEBEB]">
            <h2 className="text-xl font-semibold text-[#222222] mb-3">🗺️ {ev.region} 관광 정보</h2>
            <p className="text-sm text-[#717171] mb-4">한국관광공사 공식 데이터에서 경기장 주변 맛집·관광지·숙박을 확인하세요.</p>
            <a href={visitUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#222222] text-[#222222] font-semibold px-6 py-3 rounded-xl hover:bg-[#222222] hover:text-white transition-all">
              <Globe className="w-4 h-4"/>한국관광공사 {ev.region} 구석구석<ExternalLink className="w-3.5 h-3.5"/>
            </a>
          </div>

          {/* 지도 딥링크 */}
          <div className="py-8">
            <h2 className="text-xl font-semibold text-[#222222] mb-4">📍 경기장 위치</h2>
            <div className="bg-[#F7F7F7] rounded-2xl p-6 text-center">
              <p className="font-medium text-[#222222] mb-1">{ev.venue}</p>
              <p className="text-sm text-[#717171] mb-4">{ev.address}</p>
              <div className="flex gap-3 justify-center">
                <a href={`https://map.kakao.com/link/search/${encodeURIComponent(ev.venue)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium bg-[#FEE500] text-[#3C1E1E] px-4 py-2.5 rounded-xl">🗺️ 카카오맵</a>
                <a href={`https://map.naver.com/v5/search/${encodeURIComponent(ev.venue)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium bg-[#03C75A] text-white px-4 py-2.5 rounded-xl">🟢 네이버지도</a>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 위젯 */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white border-2 border-[#EBEBEB] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div><div className="font-semibold text-[#222222] text-lg">{ev.sport}</div><div className="text-sm text-[#717171]">{ev.region} 개최</div></div>
              {!isDone&&<div className="text-right"><div className="text-2xl font-bold text-[#FF5722]">{dday}</div><div className="text-xs text-[#717171]">남았습니다</div></div>}
            </div>
            <div className="border border-[#DDDDDD] rounded-xl overflow-hidden mb-3">
              <div className="grid grid-cols-2 divide-x divide-[#DDDDDD]">
                <div className="p-3"><div className="text-[10px] font-bold text-[#222222] uppercase mb-0.5">시작일</div><div className="text-sm font-medium text-[#222222]">{ev.start}</div></div>
                <div className="p-3"><div className="text-[10px] font-bold text-[#222222] uppercase mb-0.5">종료일</div><div className="text-sm font-medium text-[#222222]">{ev.end}</div></div>
              </div>
              <div className="border-t border-[#DDDDDD] p-3"><div className="text-[10px] font-bold text-[#222222] uppercase mb-0.5">참가 규모</div><div className="text-sm font-medium text-[#222222]">{ev.participants||'미정'}</div></div>
            </div>
            {ev.url?<a href={ev.url} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#FF5722] hover:bg-[#FF7043] text-white font-bold text-center py-4 rounded-xl transition-colors">공식 사이트에서 신청</a>
              :<div className="w-full bg-[#F7F7F7] text-[#717171] font-medium text-center py-4 rounded-xl text-sm">공식 사이트 준비 중</div>}
            <p className="text-xs text-center text-[#717171] mt-3">참가 신청은 공식 사이트에서 진행됩니다</p>
            {ev.distances&&(
              <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
                <div className="text-xs font-bold text-[#222222] mb-2">종목·거리</div>
                <div className="flex flex-wrap gap-1.5">
                  {ev.distances.split('·').map(d=><span key={d} className="text-xs bg-[#F7F7F7] text-[#717171] px-2.5 py-1 rounded-full border border-[#EBEBEB]">{d.trim()}</span>)}
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-[#DDDDDD] py-2.5 rounded-xl text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] transition-colors">
                <Share2 className="w-4 h-4"/>공유
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 비슷한 대회 */}
      {related.length>0&&(
        <div className="mt-12 pt-8 border-t border-[#EBEBEB]">
          <h2 className="text-xl font-semibold text-[#222222] mb-5">비슷한 대회</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(e=>(
              <Link key={e.id} href={`/events/${e.id}`} className="group block">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#1B4F72] to-[#2980B9] flex items-center justify-center text-4xl mb-2 group-hover:opacity-90 transition-opacity">{e.icon}</div>
                <div className="text-xs text-[#717171] mb-0.5">{e.sport} · {e.region}</div>
                <div className="text-sm font-semibold text-[#222222] line-clamp-2 group-hover:underline">{e.title}</div>
                <div className="text-xs text-[#717171] font-mono mt-0.5">{e.start}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
