'use client';
import {useState} from 'react';
import {CourseSpot,Festival,getCourseForEvent} from '@/lib/courses';
import {rankSpots,SpotType} from '@/lib/qlearning';
import {useUser} from '@/context/UserContext';
import {cn} from '@/lib/utils';
import {MapPin,Clock,Phone,Heart,Share2,ChevronRight,Star} from 'lucide-react';

type TabId='day_before'|'day_of'|'day_after';
type TypeFilter='all'|SpotType;

const TAB_LABELS:Record<TabId,string>={day_before:'전날',day_of:'당일',day_after:'이후'};
const TYPE_LABELS:Record<string,{label:string;icon:string;color:string}>={
  activity:{label:'액티비티',icon:'🏃',color:'bg-orange-50 text-orange-700 border-orange-200'},
  food:    {label:'먹거리',  icon:'🍽️',color:'bg-amber-50 text-amber-700 border-amber-200'},
  attraction:{label:'역사·관광지',icon:'🏛️',color:'bg-blue-50 text-blue-700 border-blue-200'},
  festival:{label:'축제',    icon:'🎉',color:'bg-purple-50 text-purple-700 border-purple-200'},
  hotel:   {label:'숙박',    icon:'🏨',color:'bg-green-50 text-green-700 border-green-200'},
};

interface Props{region:string;eventStart:string;eventEnd:string}

export function CourseSection({region,eventStart,eventEnd}:Props){
  const{qstate,reward,user}=useUser();
  const[tab,setTab]=useState<TabId>('day_before');
  const[typeFilter,setTypeFilter]=useState<TypeFilter>('all');
  const[favorites,setFavorites]=useState<Set<string>>(new Set());
  const course=getCourseForEvent(region);

  const rawSpots:CourseSpot[]=tab==='day_before'?course.dayBefore:tab==='day_of'?course.dayOf:course.dayAfter;

  // Q-Learning으로 정렬
  const ranked=rankSpots(rawSpots,{...qstate,companion:user?.companion||qstate.companion});
  const spots=typeFilter==='all'?ranked:ranked.filter(s=>s.type===typeFilter);

  // 기간 겹치는 축제
  const overlapFestivals=course.festivals.filter(f=>f.startDate<=eventEnd&&f.endDate>=eventStart);

  const handleClick=(spot:CourseSpot)=>{reward(spot.type,spot.name,1);};
  const handleFav=(spot:CourseSpot)=>{
    const key=spot.name;
    const next=new Set(favorites);
    if(next.has(key)){next.delete(key);}else{next.add(key);reward(spot.type,spot.name,3);}
    setFavorites(next);
  };

  return(
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-[#222222]">🗺️ 관광 코스 추천</h2>
        <div className="flex items-center gap-2">
          {user&&(
            <span className="text-xs bg-[#EBF4FF] text-[#1B4F72] px-2.5 py-1 rounded-full font-medium">
              🤖 {user.nickname}님 맞춤 추천
            </span>
          )}
          <span className="text-xs bg-[#F7F7F7] text-[#717171] px-2.5 py-1 rounded-full">한국관광공사 TourAPI</span>
        </div>
      </div>

      {/* 전날/당일/이후 탭 */}
      <div className="flex border border-[#EBEBEB] rounded-2xl overflow-hidden mb-4">
        {(Object.keys(TAB_LABELS) as TabId[]).map((t,i)=>(
          <button key={t} onClick={()=>setTab(t)}
            className={cn('flex-1 py-2.5 text-sm font-semibold transition-colors',
              tab===t?'bg-[#222222] text-white':'bg-white text-[#717171] hover:bg-[#F7F7F7]',
              i<2&&'border-r border-[#EBEBEB]')}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* 코스 타입 필터 (액티비티·먹거리·역사관광지) */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-5">
        {(['all','activity','food','attraction','festival'] as const).map(t=>(
          <button key={t} onClick={()=>setTypeFilter(t)}
            className={cn('flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border flex-shrink-0 transition-all',
              typeFilter===t?'bg-[#222222] text-white border-[#222222]':'bg-white text-[#717171] border-[#EBEBEB] hover:border-[#AAAAAA]')}>
            {t==='all'?'전체':TYPE_LABELS[t]?.icon} {t==='all'?'전체':TYPE_LABELS[t]?.label}
          </button>
        ))}
      </div>

      {/* Q-Learning 안내 (로그인 시) */}
      {user&&qstate.totalReward>5&&(
        <div className="mb-4 p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl">
          <p className="text-xs text-[#166534]">
            ✨ AI가 {user.nickname}님의 {Math.floor(qstate.totalReward/3)}번 행동을 학습했습니다. 더 정확한 코스를 추천 중입니다.
          </p>
        </div>
      )}

      {/* 기간 겹치는 지역 축제 */}
      {overlapFestivals.length>0&&(typeFilter==='all'||typeFilter==='festival')&&(
        <div className="mb-5 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
          <h3 className="text-sm font-bold text-purple-800 mb-3">🎊 대회 기간 인근 지역 축제</h3>
          <div className="space-y-2">
            {overlapFestivals.map((f,i)=>(
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3">
                <span className="text-2xl">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#222222]">{f.name}</div>
                  <div className="text-xs text-[#717171]">{f.addr}</div>
                  <div className="text-xs text-purple-600 font-mono mt-0.5">{f.startDate} ~ {f.endDate}</div>
                  <div className="text-xs text-[#717171] mt-0.5">{f.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 스팟 카드 리스트 */}
      {spots.length===0?(
        <div className="text-center py-10 text-[#717171]">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">해당 유형의 코스가 없습니다</p>
        </div>
      ):(
        <div className="space-y-3">
          {spots.map((spot,i)=>{
            const typeInfo=TYPE_LABELS[spot.type]||TYPE_LABELS.activity;
            const isFav=favorites.has(spot.name);
            const qScore=rankSpots([spot],{...qstate,companion:user?.companion||qstate.companion});
            return(
              <div key={i}>
                <div onClick={()=>handleClick(spot)}
                  className="flex gap-3 p-4 bg-white rounded-2xl border border-[#EBEBEB] hover:border-[#AAAAAA] hover:shadow-md transition-all cursor-pointer group">
                  {/* 순서 */}
                  <div className="w-7 h-7 rounded-full bg-[#222222] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                  {/* 아이콘 */}
                  <div className="w-14 h-14 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-2xl flex-shrink-0">{typeInfo.icon}</div>
                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border',typeInfo.color)}>{typeInfo.label}</span>
                      {user&&qstate.totalReward>2&&i===0&&<span className="text-xs bg-[#FFF3E0] text-[#FF5722] px-2 py-0.5 rounded-full font-semibold">⭐ AI 추천</span>}
                    </div>
                    <div className="font-semibold text-sm text-[#222222] mb-0.5 group-hover:underline">{spot.name}</div>
                    <div className="flex items-center gap-1 text-xs text-[#717171] mb-0.5"><MapPin className="w-3 h-3 flex-shrink-0"/>{spot.addr}</div>
                    {spot.note&&<div className="text-xs text-[#717171] leading-relaxed">{spot.note}</div>}
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs bg-[#F7F7F7] text-[#717171] px-2 py-0.5 rounded-full"><Clock className="w-2.5 h-2.5 inline mr-0.5"/>{spot.duration}분</span>
                      {spot.dist!=null&&spot.dist>0&&<span className="text-xs bg-[#F7F7F7] text-[#717171] px-2 py-0.5 rounded-full"><MapPin className="w-2.5 h-2.5 inline mr-0.5"/>{spot.dist<1000?`${spot.dist}m`:`${(spot.dist/1000).toFixed(1)}km`}</span>}
                      {spot.tel&&<span className="text-xs bg-[#EBF4FF] text-[#1B4F72] px-2 py-0.5 rounded-full"><Phone className="w-2.5 h-2.5 inline mr-0.5"/>{spot.tel}</span>}
                    </div>
                  </div>
                  {/* 즐겨찾기 */}
                  <button onClick={e=>{e.preventDefault();e.stopPropagation();handleFav(spot);}}
                    className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                      isFav?'bg-red-50':'hover:bg-[#F7F7F7]')}>
                    <Heart className={cn('w-4 h-4',isFav?'fill-red-500 text-red-500':'text-[#AAAAAA]')}/>
                  </button>
                </div>
                {i<spots.length-1&&(
                  <div className="flex items-center gap-2 pl-10 py-0.5">
                    <div className="w-px h-5 bg-[#EBEBEB] ml-3"/>
                    <span className="text-xs text-[#AAAAAA]">이동</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
