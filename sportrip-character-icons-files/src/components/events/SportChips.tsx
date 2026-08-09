'use client';
import {cn} from '@/lib/utils';
import {SPORTS_15} from '@/lib/sports';
import {SportIcon} from './SportIcon';

interface Props{active:string;onChange:(s:string)=>void}
export function SportChips({active,onChange}:Props){
  return(
    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
      {SPORTS_15.map(({key:label,icon})=>{
        const isActive=active===label||(label==='전체'&&!active);
        return(
          <button key={label} onClick={()=>onChange(label==='전체'?'':label)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 flex-shrink-0 border-b-2 transition-all',
              isActive?'border-[#222222] opacity-100':'border-transparent opacity-50 hover:opacity-80 hover:border-[#DDDDDD]'
            )}>
            <span className="h-8 w-11 flex items-center justify-center">
              {icon ? <SportIcon sport={label} className="h-full w-full object-contain" /> : <span className="text-2xl">🌐</span>}
            </span>
            <span className="text-xs font-medium text-[#222222] whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
