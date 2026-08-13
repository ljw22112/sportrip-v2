'use client';
import { useState } from 'react';
import { Sparkles, Clock, Lightbulb, ChevronDown, ChevronUp, RefreshCw, Navigation, Info } from 'lucide-react';

interface Place {
  name: string;
  phase: 'pre' | 'post' | null;
  category: string;
  reason: string;
  duration: string;
  travel: string;
  tip: string;
  source: 'tourapi' | 'general';
}

interface Segment {
  segment: string;
  note: string;
  places: Place[];
}

interface Course {
  event: {
    title: string; sport: string; region: string; venue: string;
    date: string; startTime: string | null;
  };
  assumptions: string[];
  segments: Segment[];
}

interface Props {
  eventTitle: string;
  region: string;
  venue: string;
  date: string;
  sport: string;
  startTime?: string;
  lat: number;
  lng: number;
}

const CATEGORY_ICON: Record<string, string> = {
  관광지: '🏛️', 명소: '🏛️', 음식점: '🍽️', 식당: '🍽️', 숙박: '🏨',
  카페: '☕', 산책: '🚶', 공원: '🌳', 온천: '♨️',
};

const SEG_COLOR = ['#0B5C43', '#1A5276', '#7D3C98'];

const PHASE_LABEL: Record<string, string> = { pre: '경기 전', post: '경기 후' };

export function AICourseSection({ eventTitle, region, venue, date, sport, startTime, lat, lng }: Props) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSeg, setOpenSeg] = useState<number | null>(0);
  const [generated, setGenerated] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. TourAPI에서 주변 관광지 병렬로 가져오기
      let nearbySpots: {name:string;addr:string;type:string}[] = [];
      try {
        const types = [
          {id:'12', label:'관광지'},
          {id:'39', label:'음식점'},
          {id:'32', label:'숙박'},
        ];
        const results = await Promise.all(
          types.map(t => fetch(`/api/tour?lat=${lat}&lng=${lng}&type=${t.id}`).then(r => r.json()).catch(() => ({items: []})))
        );
        results.forEach((d, i) => {
          (d.items || []).slice(0, 3).forEach((it: {name:string;addr:string}) => {
            nearbySpots.push({ name: it.name, addr: it.addr, type: types[i].label });
          });
        });
      } catch {}

      // 2. AI 코스 생성
      const res = await fetch('/api/ai-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventTitle, region, venue, date, sport, startTime, nearbySpots, userPrompt }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'AI 응답 오류');

      setCourse(data.course);
      setGenerated(true);
      setOpenSeg(0);
    } catch (e) {
      setError('코스 생성 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#0B5C43] to-[#1A8A63] text-white text-[13px] font-bold px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5"/>
          AI 추천 여행 코스
        </div>
        <span className="text-[11px] text-[#717171]">Powered by Gemini</span>
      </div>
      <p className="text-[13px] text-[#717171] mb-4">
        대회 일정과 {region} 주변 관광 정보를 분석해 맞춤 여행 코스를 생성합니다.
      </p>

      {/* 요청사항 입력 */}
      {!generated && (
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          disabled={loading}
          placeholder="예: 아이랑 같이 가요 / 맛집 위주로 짜주세요 / 예산은 넉넉해요 (선택 입력)"
          rows={2}
          className="w-full text-[13px] px-3.5 py-3 mb-3 rounded-xl border border-[#DDDDDD] focus:outline-none focus:border-[#0B5C43] resize-none placeholder:text-[#AAAAAA]"
        />
      )}

      {/* 생성 버튼 또는 결과 */}
      {!generated ? (
        <button onClick={generate} disabled={loading}
          className={`w-full py-5 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-all
            ${loading
              ? 'border-[#0B5C43] bg-[#E7F1EC]'
              : 'border-[#DDDDDD] hover:border-[#0B5C43] hover:bg-[#F0F9F0] bg-white'}`}>
          {loading ? (
            <>
              <div className="w-8 h-8 border-3 border-[#0B5C43] border-t-transparent rounded-full animate-spin"/>
              <span className="text-[14px] font-bold text-[#0B5C43]">Gemini가 코스를 짜고 있어요...</span>
              <span className="text-[12px] text-[#717171]">TourAPI 관광 정보 분석 중</span>
            </>
          ) : (
            <>
              <Sparkles className="w-8 h-8 text-[#0B5C43]"/>
              <span className="text-[15px] font-extrabold text-[#222]">AI 여행 코스 받기</span>
              <span className="text-[12px] text-[#717171]">전날 · 대회당일 · 다음날 맞춤 코스 생성</span>
            </>
          )}
        </button>
      ) : course ? (
        <div>
          {/* 추정 안내 */}
          {course.assumptions?.length > 0 && (
            <div className="bg-[#F0F4FF] border border-[#C7D6FF] rounded-xl px-3.5 py-2.5 mb-3 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#3D5AFE] flex-shrink-0 mt-0.5"/>
              <div className="text-[12px] text-[#3D4EAD] space-y-0.5">
                {course.assumptions.map((a, i) => <p key={i}>{a}</p>)}
              </div>
            </div>
          )}

          {/* 인트로 */}
          <div className="bg-gradient-to-r from-[#0B5C43] to-[#1A8A63] text-white rounded-2xl px-5 py-4 mb-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#D6F14E]"/>
            <div>
              <div className="text-[11px] font-bold text-[#D6F14E] mb-0.5">Gemini 추천 코스</div>
              <div className="text-[15px] font-bold">{course.event.title}</div>
            </div>
          </div>

          {/* 구간 아코디언 */}
          <div className="space-y-3 mb-4">
            {course.segments.map((seg, si) => (
              <div key={si} className="border-2 rounded-2xl overflow-hidden"
                style={{borderColor: SEG_COLOR[si % 3] + '55'}}>
                <button onClick={() => setOpenSeg(openSeg===si ? null : si)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                  style={{background: SEG_COLOR[si % 3] + '0D'}}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-[13px] flex-shrink-0"
                      style={{background: SEG_COLOR[si % 3]}}>
                      {si + 1}
                    </span>
                    <div>
                      <div className="font-bold text-[15px] text-[#222]">{seg.segment}</div>
                      <div className="text-[12px] text-[#717171]">{seg.note}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#717171]">{seg.places.length}곳</span>
                    {openSeg === si ? <ChevronUp className="w-4 h-4 text-[#717171]"/> : <ChevronDown className="w-4 h-4 text-[#717171]"/>}
                  </div>
                </button>

                {openSeg === si && (
                  <div className="px-4 py-3 space-y-4">
                    {seg.places.map((place, pi) => (
                      <div key={pi} className="flex gap-3">
                        {/* 번호 */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                            style={{background: SEG_COLOR[si % 3]}}>
                            {pi + 1}
                          </div>
                          {pi < seg.places.length - 1 && (
                            <div className="w-px flex-1 mt-1" style={{background: SEG_COLOR[si % 3] + '30', minHeight: 24}}/>
                          )}
                        </div>
                        {/* 내용 */}
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-lg">{CATEGORY_ICON[place.category] || '📍'}</span>
                            <span className="font-bold text-[15px] text-[#222]">{place.name}</span>
                            <span className="text-[11px] text-[#717171] border border-[#EBEBEB] px-2 py-0.5 rounded-full">{place.category}</span>
                            {place.phase && (
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  color: place.phase === 'pre' ? '#B26A00' : '#0B5C43',
                                  background: place.phase === 'pre' ? '#FFF3DE' : '#E7F1EC',
                                }}>
                                {PHASE_LABEL[place.phase]}
                              </span>
                            )}
                            {place.source === 'general' && (
                              <span className="text-[10px] text-[#999] border border-[#EEE] px-1.5 py-0.5 rounded-full">
                                일반 추천
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-[#555] leading-relaxed mb-1.5">{place.reason}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1 text-[12px] text-[#717171]">
                              <Clock className="w-3 h-3"/> {place.duration}
                            </div>
                            {place.travel && (
                              <div className="flex items-center gap-1 text-[12px] text-[#717171]">
                                <Navigation className="w-3 h-3"/> {place.travel}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-[12px] text-[#0B5C43] font-semibold">
                              <Lightbulb className="w-3 h-3"/> {place.tip}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 다시 생성 */}
          <button onClick={()=>{setCourse(null);setGenerated(false);setUserPrompt('');}}
            className="mt-3 flex items-center gap-1.5 text-[12px] text-[#717171] hover:text-[#0B5C43] transition-colors">
            <RefreshCw className="w-3.5 h-3.5"/> 다른 코스 받기
          </button>
        </div>
      ) : null}

      {error && (
        <div className="text-[13px] text-red-500 mt-2">{error}</div>
      )}
    </div>
  );
}