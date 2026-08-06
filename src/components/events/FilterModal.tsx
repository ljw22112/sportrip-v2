'use client';
import {X} from 'lucide-react';
import {REGIONS} from '@/lib/data';
import {cn} from '@/lib/utils';

interface Props{
  open:boolean;onClose:()=>void;
  region:string;setRegion:(v:string)=>void;
  status:string;setStatus:(v:string)=>void;
  dateFrom:string;setDateFrom:(v:string)=>void;
  onReset:()=>void;
}
export function FilterModal({open,onClose,region,setRegion,status,setStatus,dateFrom,setDateFrom,onReset}:Props){
  if(!open)return null;
  const count=[region,status,dateFrom].filter(Boolean).length;
  return(
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white w-full md:w-[540px] rounded-t-3xl md:rounded-3xl z-10 max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
          <button onClick={onClose} className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors">
            <X className="w-5 h-5"/>
          </button>
          <span className="font-semibold text-[#222222]">필터</span>
          <div className="w-9"/>
        </div>
        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* 지역 */}
          <div>
            <h3 className="font-semibold text-[#222222] mb-3">지역</h3>
            <div className="grid grid-cols-3 gap-2">
              {['전체 지역',...REGIONS.slice(1)].map(r=>(
                <button key={r} onClick={()=>setRegion(r==='전체 지역'?'':r)}
                  className={cn(
                    'py-3 px-2 rounded-xl text-sm font-medium border transition-all text-center',
                    (region===r||(r==='전체 지역'&&!region))
                      ?'border-[#222222] bg-[#F7F7F7] font-semibold'
                      :'border-[#EBEBEB] hover:border-[#AAAAAA]'
                  )}>{r}</button>
              ))}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB]"/>
          {/* 대회 상태 */}
          <div>
            <h3 className="font-semibold text-[#222222] mb-3">대회 상태</h3>
            <div className="flex gap-3">
              {[{v:'',l:'전체'},{v:'upcoming',l:'⏳ 예정'},{v:'ongoing',l:'🔥 진행중'},{v:'done',l:'✅ 종료'}].map(s=>(
                <button key={s.v} onClick={()=>setStatus(s.v)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-medium border transition-all',
                    status===s.v?'border-[#222222] bg-[#F7F7F7] font-semibold':'border-[#EBEBEB] hover:border-[#AAAAAA]'
                  )}>{s.l}</button>
              ))}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB]"/>
          {/* 날짜 */}
          <div>
            <h3 className="font-semibold text-[#222222] mb-3">대회 시작일 이후</h3>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EBEBEB] text-sm outline-none focus:border-[#222222] transition-colors"/>
          </div>
        </div>
        {/* 하단 버튼 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EBEBEB]">
          <button onClick={()=>{onReset();onClose();}}
            className="text-sm font-semibold text-[#222222] underline">전체 해제</button>
          <button onClick={onClose}
            className="bg-[#222222] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#444444] transition-colors">
            결과 보기{count>0?` (${count}개 적용)`:''}</button>
        </div>
      </div>
    </div>
  );
}
