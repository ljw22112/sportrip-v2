'use client';
import {cn} from '@/lib/utils';

const CHIPS=[
  {label:'전체',icon:'🏆'},{label:'마라톤',icon:'🏃'},
  {label:'종합',icon:'🏅'},{label:'배드민턴',icon:'🏸'},
  {label:'수영',icon:'🏊'},{label:'축구',icon:'⚽'},
  {label:'테니스',icon:'🎾'},{label:'사이클',icon:'🚴'},
  {label:'골프',icon:'⛳'},{label:'야구',icon:'⚾'},
  {label:'농구',icon:'🏀'},{label:'배구',icon:'🏐'},
  {label:'태권도',icon:'🥋'},{label:'기타',icon:'🎯'},
];
interface Props{active:string;onChange:(s:string)=>void}
export function SportChips({active,onChange}:Props){
  return(
    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
      {CHIPS.map(({label,icon})=>{
        const isActive=active===label||(label==='전체'&&!active);
        return(
          <button key={label} onClick={()=>onChange(label==='전체'?'':label)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 flex-shrink-0 border-b-2 transition-all',
              isActive?'border-[#222222] opacity-100':'border-transparent opacity-50 hover:opacity-80 hover:border-[#DDDDDD]'
            )}>
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-medium text-[#222222] whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
