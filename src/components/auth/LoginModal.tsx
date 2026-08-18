'use client';
import {useState} from 'react';
import {X,CheckCircle2,User,Shield,ChevronDown,ChevronUp} from 'lucide-react';
import {cn} from '@/lib/utils';
export type CompanionType='solo'|'couple'|'family'|'friend'|'senior';

interface Props{open:boolean;onClose:()=>void;onLogin:(companion:CompanionType,nickname:string)=>void}

const COMPANIONS=[
  {id:'solo' as CompanionType,label:'혼자 여행',icon:'🧍',desc:'나만의 자유로운 코스'},
  {id:'couple' as CompanionType,label:'연인과 함께',icon:'💑',desc:'로맨틱한 두 사람의 여행'},
  {id:'family' as CompanionType,label:'가족 여행',icon:'👨‍👩‍👧',desc:'온 가족이 즐거운 코스'},
  {id:'friend' as CompanionType,label:'친구와 함께',icon:'👫',desc:'신나고 활동적인 여행'},
  {id:'senior' as CompanionType,label:'시니어 여행',icon:'🧓',desc:'편안하고 여유로운 코스'},
];
const TERMS=`스포트립 서비스 이용약관\n\n제1조(목적) 본 약관은 스포트립이 제공하는 서비스 이용에 관한 조건을 규정합니다.\n\n제2조(서비스) 전국 스포츠 대회 정보 및 AI 기반 관광 코스 추천 서비스를 제공합니다.\n\n제3조(책임) 대회 일정은 주최사 사정으로 변경될 수 있으며, 서비스는 공공데이터를 활용합니다.`;
const PRIVACY=`개인정보 수집·이용 동의\n\n수집항목: 닉네임, 동반유형, 이용 행동 기록\n이용목적: Q-Learning 기반 맞춤 관광코스 추천\n보유기간: 브라우저 로컬스토리지 (탈퇴 시 삭제)\n제3자 제공: 없음\n\n※ 수집 정보는 개인화 목적으로만 사용되며 외부 제공 없음`;

export function LoginModal({open,onClose,onLogin}:Props){
  const[step,setStep]=useState<1|2|3>(1);
  const[companion,setCompanion]=useState<CompanionType>('solo');
  const[nickname,setNickname]=useState('');
  const[agreeTerms,setAgreeTerms]=useState(false);
  const[agreePrivacy,setAgreePrivacy]=useState(false);
  const[showTerms,setShowTerms]=useState(false);
  const[showPrivacy,setShowPrivacy]=useState(false);
  if(!open)return null;
  const done=()=>{if(!nickname.trim()||!agreeTerms||!agreePrivacy)return;onLogin(companion,nickname.trim());onClose();setStep(1);};
  return(
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-3xl z-10 max-h-[92vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <button onClick={onClose} className="p-2 hover:bg-[#F7F7F7] rounded-full"><X className="w-5 h-5"/></button>
          <span className="font-bold text-[#222222]">{step===1?'시작하기':step===2?'여행 유형 선택':'약관 동의'}</span>
          <div className="w-9"/>
        </div>
        <div className="flex px-6 pt-3 gap-2 pb-1">
          {[1,2,3].map(s=><div key={s} className={cn('flex-1 h-1 rounded-full transition-colors',step>=s?'bg-[#FF5722]':'bg-[#EBEBEB]')}/>)}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step===1&&(
            <div>
              <div className="flex justify-center mb-5"><div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center text-3xl">⚽</div></div>
              <h2 className="text-xl font-bold text-[#222222] text-center mb-1">스포트립에 오신 것을 환영합니다!</h2>
              <p className="text-sm text-muted text-center mb-6">닉네임을 입력하면 AI가 맞춤 관광코스를 추천해드립니다</p>
              <label className="block text-xs font-bold text-[#222222] mb-2">닉네임</label>
              <input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="사용할 닉네임 (2~10자)" maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#222222] mb-1 transition-colors"/>
              {nickname.length>0&&nickname.length<2&&<p className="text-xs text-red-500 mb-3">2자 이상 입력해주세요</p>}
              <button onClick={()=>setStep(2)} disabled={nickname.length<2}
                className={cn('w-full mt-4 py-3.5 rounded-xl font-bold text-sm transition-colors',nickname.length>=2?'bg-[#FF5722] text-white hover:bg-[#FF7043]':'bg-[#EBEBEB] text-faint cursor-not-allowed')}>
                다음 →
              </button>
            </div>
          )}
          {step===2&&(
            <div>
              <h2 className="text-lg font-bold text-[#222222] mb-1">주로 어떻게 여행하시나요?</h2>
              <p className="text-sm text-muted mb-5">Q-Learning AI가 선택에 맞는 코스를 추천합니다</p>
              <div className="space-y-3">
                {COMPANIONS.map(c=>(
                  <button key={c.id} onClick={()=>setCompanion(c.id)}
                    className={cn('w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',companion===c.id?'border-[#222222] bg-[#F7F7F7]':'border-border hover:border-[#AAAAAA]')}>
                    <span className="text-3xl">{c.icon}</span>
                    <div className="flex-1"><div className="font-semibold text-sm text-[#222222]">{c.label}</div><div className="text-xs text-muted">{c.desc}</div></div>
                    {companion===c.id&&<CheckCircle2 className="w-5 h-5 text-[#222222]"/>}
                  </button>
                ))}
              </div>
              <button onClick={()=>setStep(3)} className="w-full mt-5 py-3.5 bg-[#FF5722] text-white rounded-xl font-bold text-sm hover:bg-[#FF7043] transition-colors">다음 →</button>
            </div>
          )}
          {step===3&&(
            <div>
              <div className="flex justify-center mb-3"><Shield className="w-10 h-10 text-[#FF5722]"/></div>
              <h2 className="text-lg font-bold text-[#222222] text-center mb-1">약관에 동의해 주세요</h2>
              <p className="text-sm text-muted text-center mb-4">필수 동의 후 서비스를 이용할 수 있습니다</p>
              <button onClick={()=>{setAgreeTerms(true);setAgreePrivacy(true);}}
                className={cn('w-full flex items-center gap-3 p-4 rounded-2xl border-2 mb-3 transition-all',agreeTerms&&agreePrivacy?'border-[#222222] bg-[#F7F7F7]':'border-border')}>
                <CheckCircle2 className={cn('w-6 h-6',agreeTerms&&agreePrivacy?'text-[#222222]':'text-[#DDDDDD]')}/>
                <span className="font-bold text-sm text-[#222222]">전체 동의</span>
              </button>
              {[{flag:agreeTerms,setFlag:setAgreeTerms,show:showTerms,setShow:setShowTerms,label:'[필수] 서비스 이용약관',text:TERMS},
                {flag:agreePrivacy,setFlag:setAgreePrivacy,show:showPrivacy,setShow:setShowPrivacy,label:'[필수] 개인정보 수집·이용 동의',text:PRIVACY}].map((item,i)=>(
                <div key={i} className="border border-border rounded-2xl overflow-hidden mb-3">
                  <div className="flex items-center gap-3 p-4">
                    <button onClick={()=>item.setFlag((v:boolean)=>!v)}><CheckCircle2 className={cn('w-5 h-5',item.flag?'text-[#FF5722]':'text-[#DDDDDD]')}/></button>
                    <span className="text-sm font-medium text-[#222222] flex-1">{item.label}</span>
                    <button onClick={()=>item.setShow((v:boolean)=>!v)} className="text-muted">{item.show?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}</button>
                  </div>
                  {item.show&&<div className="px-4 pb-4 border-t border-border"><pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed bg-[#F7F7F7] p-3 rounded-xl max-h-28 overflow-y-auto">{item.text}</pre></div>}
                </div>
              ))}
              <div className="p-3 bg-[#EBF4FF] rounded-xl mb-4">
                <p className="text-xs text-[#1B4F72]">🤖 <b>AI 맞춤 추천:</b> 이용 기록이 쌓일수록 Q-Learning이 더 정확한 코스를 추천합니다</p>
              </div>
              <button onClick={done} disabled={!agreeTerms||!agreePrivacy}
                className={cn('w-full py-3.5 rounded-xl font-bold text-sm transition-colors',agreeTerms&&agreePrivacy?'bg-[#FF5722] text-white hover:bg-[#FF7043]':'bg-[#EBEBEB] text-faint cursor-not-allowed')}>
                {nickname}님, 시작하기 🚀
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
