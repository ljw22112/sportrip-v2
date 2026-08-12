import{SportEvent}from'@/types';

export const SPORTS=['전체','마라톤','종합','배드민턴','수영','축구','테니스','사이클','골프','야구','농구','배구','태권도','유도','기타'];
export const REGIONS=['전체 지역','서울','부산','대구','인천','광주','대전','울산','경기','강원','충북','충남','전북','전남','경북','경남','세종','제주'];

export type ScaleLevel = 'small' | 'medium' | 'large' | 'xlarge';
export function calcScale(participants: string): ScaleLevel {
  const n = parseInt(participants.replace(/[^0-9]/g,'')) || 0;
  if (n <= 1000) return 'small';
  if (n <= 5000) return 'medium';
  if (n <= 15000) return 'large';
  return 'xlarge';
}
export const SCALE_LABELS = {
  small:  { text: '소규모',  sub: '1,000명 이하',  color: '#555',    bg: '#F7F7F6' },
  medium: { text: '중규모',  sub: '5,000명 이하',  color: '#1A5276', bg: '#EBF5FB' },
  large:  { text: '대규모',  sub: '15,000명 이하', color: '#B7791F', bg: '#FEFCE8' },
  xlarge: { text: '초대형',  sub: '15,000명 이상', color: '#922B21', bg: '#FDEDEC' },
};

export type VerifiedStatus = 'verified' | 'unverified' | 'public';

export function calcVerified(id: number, url: string): VerifiedStatus {
  if (id >= 200) return 'public'; // 공공데이터 자동수집
  if (!url) return 'unverified';
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    const knownDomains = [
      'marathon.jtbc.com','chuncheonmarathon.com','daegumarathon.co.kr',
      'tourdekorea.or.kr','koreabaseball.com','kbl.or.kr','kovo.co.kr',
      'kleague.com','kfa.or.kr','badmintonkorea.org','swimming.or.kr',
      'koreataekwondo.org','judo.or.kr','kgto.co.kr','sports.or.kr',
      'kosad.or.kr','kaaf.or.kr','koreacycling.or.kr','kortennis.co.kr',
      'ironman.com','triathlon.or.kr',
    ];
    if (knownDomains.some(d => domain.includes(d.replace('www.',''))))
      return 'verified';
  } catch {}
  return 'unverified';
}

export const VERIFIED_LABELS = {
  verified:   { text: '✅ 검증됨',     color: '#0B5C43', bg: '#E7F1EC' },
  unverified: { text: '⚠️ 미확인',     color: '#B7791F', bg: '#FEFCE8' },
  public:     { text: '📋 공공데이터', color: '#1A5276', bg: '#EBF5FB' },
};

export type RegistrationStatus = 'open' | 'closing' | 'closed' | 'tba';

export function calcRegistrationStatus(start: string, deadline?: string): RegistrationStatus {
  const today = new Date();
  const startDate = new Date(start);
  const daysToStart = Math.ceil((startDate.getTime() - today.getTime()) / 86400000);
  if (!deadline) {
    if (daysToStart < 0) return 'closed';
    if (daysToStart <= 7) return 'closing';
    if (daysToStart <= 60) return 'open';
    return 'tba';
  }
  const deadlineDate = new Date(deadline);
  const daysToDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / 86400000);
  if (daysToDeadline < 0) return 'closed';
  if (daysToDeadline <= 7) return 'closing';
  return 'open';
}

export const REG_STATUS_LABELS = {
  open:    { text: '접수 중',    color: '#0B5C43', bg: '#E7F1EC' },
  closing: { text: '마감 임박',  color: '#C0392B', bg: '#FDEDEC' },
  closed:  { text: '접수 마감', color: '#717171', bg: '#F7F7F6' },
  tba:     { text: '추후 공지', color: '#1A5276', bg: '#EBF5FB' },
};

export function calcDday(s:string):string{
  // Asia/Seoul 타임존 기준으로 오늘 날짜 계산
  const nowKR = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Seoul'}));
  const target = new Date(s + 'T00:00:00+09:00');
  const d=Math.ceil((target.getTime()-nowKR.getTime())/86400000);
  return d>0?`D-${d}`:d===0?'D-Day':'종료';
}
export function calcStatus(s:string,e:string):'upcoming'|'ongoing'|'done'{
  const t=new Date(),st=new Date(s),en=new Date(e);
  if(en<t)return'done';if(st<=t)return'ongoing';return'upcoming';
}

export const EVENTS:SportEvent[]=[
  {id:0,title:'2026 서울마라톤 (제96회 동아마라톤)',sport:'마라톤',icon:'🏃',venue:'광화문광장 → 잠실올림픽주경기장',address:'서울 종로구 세종대로 172',start:'2026-03-15',end:'2026-03-15',status:'done',region:'서울',desc:'국내 최대 공인 풀코스 마라톤. IAAF 골드 라벨.',url:'https://www.seoulmarathon.com',participants:'40,000명',lat:37.5716,lng:126.9768,distances:'풀코스·10K'},
  {id:2,title:'2026 경주국제마라톤',sport:'마라톤',icon:'🏃',venue:'경주 보문단지',address:'경북 경주시 보문로 213-1',start:'2026-04-05',end:'2026-04-05',status:'done',region:'경북',desc:'벚꽃 시즌 경주 유적지 코스. 풀·하프·10K.',url:'https://www.gyeongjumarathon.com',participants:'15,000명',lat:35.8528,lng:129.2692,distances:'풀코스·하프·10K'},
  {id:3,title:'2026 세종협회장기 배드민턴',sport:'배드민턴',icon:'🏸',venue:'세종 한솔체육관',address:'세종 한솔동 8',start:'2026-02-07',end:'2026-02-08',status:'done',region:'세종',desc:'세종 배드민턴협회 주최.',url:'https://www.badmintongame.co.kr',participants:'300명',lat:36.48,lng:127.289,distances:'단식·복식'},
  {id:4,title:'2026 JTBC 서울마라톤',sport:'마라톤',icon:'🏃',venue:'잠실올림픽주경기장',address:'서울 송파구 올림픽로 25',start:'2026-10-18',end:'2026-10-18',status:'upcoming',region:'서울',desc:'추첨제. 풀·하프·10km.',url:'https://www.jtbcmarathon.com',participants:'30,000명',lat:37.5149,lng:127.0738,distances:'풀코스·하프·10K'},
  {id:5,title:'2026 춘천마라톤 (가을의 전설)',sport:'마라톤',icon:'🏃',venue:'의암호 순환 코스',address:'강원 춘천시 스포츠타운길 99',start:'2026-10-25',end:'2026-10-25',status:'upcoming',region:'강원',desc:'의암호 절경 코스. 선착순.',url:'https://www.chuncheonmarathon.com',participants:'15,000명',lat:37.8813,lng:127.7298,distances:'풀코스·하프'},
  {id:6,title:'성우하이텍 2026 부산바다마라톤',sport:'마라톤',icon:'🏃',venue:'해운대 벡스코 야외광장',address:'부산 해운대구 APEC로 55 (벡스코)',start:'2026-10-25',end:'2026-10-25',status:'upcoming',region:'부산',desc:'광안대교 상층부 출발, 부산 해안 코스를 달리는 대표 마라톤 대회.',url:'https://www.busanilbo.com',participants:'12,000명',lat:35.1694,lng:129.1317,distances:'15km·10km·5km'},
  {id:13,title:'2026 전국수영선수권대회',sport:'수영',icon:'🏊',venue:'광주 남부대시립수영장',address:'광주 광산구 첨단과기로 208-1',start:'2026-10-15',end:'2026-10-18',status:'upcoming',region:'광주',desc:'전국 수영 최강자 선수권.',url:'https://www.swimming.or.kr',participants:'2,000명',lat:35.2196,lng:126.8472,distances:'자유형·배영·평영'},
  {id:14,title:'2026 KBO 한국시리즈',sport:'야구',icon:'⚾',venue:'서울 잠실야구장',address:'서울 송파구 올림픽로 19-2',start:'2026-10-22',end:'2026-10-31',status:'upcoming',region:'서울',desc:'2026 KBO리그 한국시리즈.',url:'https://www.koreabaseball.com',participants:'25,000명',lat:37.5122,lng:127.072,distances:'프로야구'},
  {id:15,title:'2026 KBL 프로농구 개막전',sport:'농구',icon:'🏀',venue:'원주 종합체육관',address:'강원 원주시 무실동 1330',start:'2026-10-18',end:'2026-10-18',status:'upcoming',region:'강원',desc:'2026-27 KBL 정규시즌 개막.',url:'https://www.kbl.or.kr',participants:'10,000명',lat:37.3392,lng:127.9203,distances:'프로농구'},
  {id:16,title:'2026 V리그 프로배구 개막',sport:'배구',icon:'🏐',venue:'인천 계양체육관',address:'인천 계양구 계양산로 90',start:'2026-10-15',end:'2026-10-15',status:'upcoming',region:'인천',desc:'2026-27 V리그 배구 정규시즌 개막.',url:'https://kovo.co.kr',participants:'8,000명',lat:37.537,lng:126.738,distances:'남녀프로배구'},
  {id:17,title:'2026 전국태권도선수권',sport:'태권도',icon:'🥋',venue:'무주 태권도원',address:'전북 무주군 설천면 무설로 1482',start:'2026-10-15',end:'2026-10-19',status:'upcoming',region:'전북',desc:'전국 태권도 최강자 선수권.',url:'https://www.koreataekwondo.org',participants:'3,000명',lat:35.9024,lng:127.7179,distances:'남녀품새·겨루기'},
  {id:23,title:'2026 투르드코리아 사이클',sport:'사이클',icon:'🚴',venue:'서울 광화문 출발',address:'서울 종로구 세종대로 172',start:'2026-10-18',end:'2026-10-24',status:'upcoming',region:'서울',desc:'UCI 2.1 등급 국제 사이클 대회.',url:'https://tourdekorea.or.kr',participants:'200명',lat:37.5716,lng:126.9768,distances:'UCI 2.1'},
  {id:24,title:'2026 K리그 파이널 라운드',sport:'축구',icon:'⚽',venue:'수원월드컵경기장',address:'경기 수원시 팔달구 월드컵로 310',start:'2026-10-31',end:'2026-11-29',status:'upcoming',region:'경기',desc:'K리그1 2026 파이널 라운드.',url:'https://www.kleague.com',participants:'43,000명',lat:37.2896,lng:127.0065,distances:'프로축구'},
  {id:25,title:'2026 전국장애인체육대회',sport:'종합',icon:'🏅',venue:'대전 한밭체육관',address:'대전 유성구 대학로 99',start:'2026-10-22',end:'2026-10-27',status:'upcoming',region:'대전',desc:'전국 장애인 스포츠 축제.',url:'https://www.kosad.or.kr',participants:'5,000명',lat:36.3664,lng:127.3453,distances:'종합'},
  {id:26,title:'2026 경기도 종별체육대회',sport:'종합',icon:'🏅',venue:'수원종합운동장',address:'경기 수원시 팔달구 효원로 241',start:'2026-10-14',end:'2026-10-20',status:'upcoming',region:'경기',desc:'경기도 31개 시·군 스포츠 축제.',url:'https://www.sports.or.kr',participants:'10,000명',lat:37.2636,lng:127.0286,distances:'종합'},
  {id:27,title:'2026 서울시 종별체육대회',sport:'종합',icon:'🏅',venue:'잠실종합운동장',address:'서울 송파구 올림픽로 25',start:'2026-10-07',end:'2026-10-12',status:'upcoming',region:'서울',desc:'서울 25개 자치구 스포츠 축제.',url:'https://www.sports.or.kr',participants:'8,000명',lat:37.515,lng:127.073,distances:'종합'},
  {id:28,title:'2026 부산 종별체육대회',sport:'종합',icon:'🏅',venue:'부산 아시아드주경기장',address:'부산 서구 월드컵대로 344',start:'2026-10-21',end:'2026-10-26',status:'upcoming',region:'부산',desc:'부산 16개 구·군 스포츠 축제.',url:'https://www.sports.or.kr',participants:'7,000명',lat:35.1318,lng:129.014,distances:'종합'},
  {id:29,title:'2026 강원도 종별체육대회',sport:'종합',icon:'🏅',venue:'강릉종합운동장',address:'강원 강릉시 종합운동장길 88',start:'2026-10-28',end:'2026-11-02',status:'upcoming',region:'강원',desc:'강원도 18개 시·군 스포츠 축제.',url:'https://www.sports.or.kr',participants:'5,000명',lat:37.752,lng:128.876,distances:'종합'},
  {id:30,title:'2026 전북 종별체육대회',sport:'종합',icon:'🏅',venue:'전주종합경기장',address:'전북 전주시 덕진구 팔달로 350',start:'2026-10-14',end:'2026-10-19',status:'upcoming',region:'전북',desc:'전북 14개 시·군 스포츠 축제.',url:'https://www.sports.or.kr',participants:'4,500명',lat:35.8234,lng:127.1289,distances:'종합'},
  {id:41,title:'2026 추계전국테니스선수권',sport:'테니스',icon:'🎾',venue:'대전 한밭테니스장',address:'대전 서구 둔산대로 222',start:'2026-10-20',end:'2026-10-24',status:'upcoming',region:'대전',desc:'전국 테니스 선수권 추계 대회.',url:'https://www.kortennis.co.kr',participants:'1,200명',lat:36.3514,lng:127.3845,distances:'남녀단복식'},
  {id:42,title:'2026 전국마스터즈수영대회',sport:'수영',icon:'🏊',venue:'수원 실내수영장',address:'경기 수원시 영통구 대학4로 45',start:'2026-10-15',end:'2026-10-18',status:'upcoming',region:'경기',desc:'만 25세 이상 동호인 수영 오픈.',url:'https://www.swimming.or.kr',participants:'3,000명',lat:37.2804,lng:127.0444,distances:'자유형·배영·평영'},
  {id:43,title:'2026 전국오픈수영대회 (부산)',sport:'수영',icon:'🏊',venue:'부산국제수영장',address:'부산 해운대구 APEC로 58',start:'2026-11-05',end:'2026-11-08',status:'upcoming',region:'부산',desc:'국내외 선수들이 참가하는 오픈 수영.',url:'https://www.swimming.or.kr',participants:'1,000명',lat:35.1796,lng:129.1756,distances:'자유형·개인혼영'},
  {id:44,title:'2026 전국유도선수권',sport:'유도',icon:'🥋',venue:'충주 세계무술공원',address:'충북 충주시 대소원면',start:'2026-10-22',end:'2026-10-25',status:'upcoming',region:'충북',desc:'전국 유도 선수권대회.',url:'https://www.judo.or.kr',participants:'1,200명',lat:36.9567,lng:127.8941,distances:'남녀급별'},
  {id:45,title:'2026 전국태권도선수권 (국제)',sport:'태권도',icon:'🥋',venue:'서울 올림픽체조경기장',address:'서울 송파구 올림픽로 424',start:'2026-11-05',end:'2026-11-08',status:'upcoming',region:'서울',desc:'WTF 공인 국제 태권도 대회.',url:'https://www.koreataekwondo.org',participants:'2,000명',lat:37.5193,lng:127.1267,distances:'남녀품새·겨루기'},
  {id:46,title:'2026 전국추계농구대회',sport:'농구',icon:'🏀',venue:'잠실학생체육관',address:'서울 송파구 올림픽로 424',start:'2026-10-08',end:'2026-10-13',status:'upcoming',region:'서울',desc:'전국 남녀 추계 농구 선수권.',url:'https://www.kbl.or.kr',participants:'2,000명',lat:37.518,lng:127.1236,distances:'남녀일반부'},
  {id:47,title:'2026 추계전국배구대회',sport:'배구',icon:'🏐',venue:'천안 유관순체육관',address:'충남 천안시 서북구 쌍용동 1042',start:'2026-10-20',end:'2026-10-25',status:'upcoming',region:'충남',desc:'전국 남녀 추계 배구 선수권.',url:'https://kovo.co.kr',participants:'1,500명',lat:36.8151,lng:127.1139,distances:'남녀일반부'},
  {id:48,title:'2026 추계전국대학축구',sport:'축구',icon:'⚽',venue:'김천종합스포츠타운',address:'경북 김천시 혁신6로 55',start:'2026-10-12',end:'2026-10-18',status:'upcoming',region:'경북',desc:'전국 대학 축구 최강 결정전.',url:'https://www.kfa.or.kr',participants:'3,000명',lat:36.1398,lng:128.1137,distances:'대학부'},
  {id:49,title:'2026 전국실업축구 결승',sport:'축구',icon:'⚽',venue:'서울월드컵경기장',address:'서울 마포구 월드컵로 240',start:'2026-11-01',end:'2026-11-01',status:'upcoming',region:'서울',desc:'전국 실업 축구 최강팀 결정전.',url:'https://www.kfa.or.kr',participants:'30,000명',lat:37.5686,lng:126.8973,distances:'실업부'},
  {id:50,title:'2026 전국탁구선수권',sport:'기타',icon:'🏓',venue:'대전 충무체육관',address:'대전 중구 보문로 246',start:'2026-10-14',end:'2026-10-18',status:'upcoming',region:'대전',desc:'전국 탁구 최강자 선발전.',url:'https://www.tabletennis.or.kr',participants:'1,500명',lat:36.322,lng:127.4208,distances:'남녀단복식'},
  {id:51,title:'2026 전국볼링대회',sport:'기타',icon:'🎳',venue:'성남 볼링장',address:'경기 성남시 분당구 서현동 255',start:'2026-10-22',end:'2026-10-25',status:'upcoming',region:'경기',desc:'전국 볼링 남녀 선수권.',url:'https://www.bowling.or.kr',participants:'1,000명',lat:37.384,lng:127.1216,distances:'남녀일반부'},
  {id:52,title:'2026 전국사격선수권',sport:'기타',icon:'🎯',venue:'태릉 국제사격장',address:'서울 노원구 화랑로 261',start:'2026-10-06',end:'2026-10-10',status:'upcoming',region:'서울',desc:'전국 사격 선수권대회.',url:'https://www.shooting.or.kr',participants:'500명',lat:37.6401,lng:127.0836,distances:'공기소총·권총'},
  {id:53,title:'2026 전국조정선수권',sport:'기타',icon:'🚣',venue:'충주 탄금호 조정경기장',address:'충북 충주시 번영대로 24',start:'2026-10-08',end:'2026-10-12',status:'upcoming',region:'충북',desc:'전국 조정 남녀 선수권.',url:'https://www.rowing.or.kr',participants:'800명',lat:36.9701,lng:127.9255,distances:'싱글·더블·팀'},
  {id:54,title:'2026 전국역도선수권',sport:'기타',icon:'🏋️',venue:'고양 어울림누리',address:'경기 고양시 덕양구 화중로 26',start:'2026-10-20',end:'2026-10-23',status:'upcoming',region:'경기',desc:'전국 역도 최강자 가리기.',url:'https://www.weightlifting.or.kr',participants:'600명',lat:37.652,lng:126.8319,distances:'남녀급별'},
  {id:55,title:'2026 전국체조선수권',sport:'기타',icon:'🤸',venue:'충주 실내체육관',address:'충북 충주시 연수동 185',start:'2026-10-28',end:'2026-11-01',status:'upcoming',region:'충북',desc:'전국 남녀 체조 선수권.',url:'https://www.sports.or.kr',participants:'800명',lat:36.991,lng:127.9259,distances:'남녀기계체조'},
  {id:56,title:'2026 전국장사씨름대회',sport:'기타',icon:'🤼',venue:'강릉 아이스아레나',address:'강원 강릉시 종합운동장길 93',start:'2026-10-28',end:'2026-11-01',status:'upcoming',region:'강원',desc:'천하장사를 가리는 전통 씨름.',url:'https://www.sports.or.kr',participants:'500명',lat:37.752,lng:128.876,distances:'체급별·통합'},
  {id:57,title:'2026 전국스포츠클라이밍선수권',sport:'기타',icon:'🧗',venue:'서울 노원구 실내암벽장',address:'서울 노원구 중계동 2-1',start:'2026-10-08',end:'2026-10-11',status:'upcoming',region:'서울',desc:'전국 스포츠클라이밍 최강자.',url:'https://www.climbing.or.kr',participants:'600명',lat:37.6543,lng:127.0645,distances:'리드·볼더링·속도'},
  {id:58,title:'2026 전국양궁선수권',sport:'기타',icon:'🏹',venue:'충주 탄금대 양궁장',address:'충북 충주시 칠금동 산 1-1',start:'2026-10-28',end:'2026-11-01',status:'upcoming',region:'충북',desc:'전국 양궁 남녀 선수권.',url:'https://www.archery.or.kr',participants:'500명',lat:36.984,lng:127.922,distances:'리커브·컴파운드'},
  {id:59,title:'2026 전국파크골프선수권',sport:'골프',icon:'⛳',venue:'세종 파크골프장',address:'세종 금남면 대평리',start:'2026-10-14',end:'2026-10-16',status:'upcoming',region:'세종',desc:'전국 파크골프 동호인 선수권.',url:'https://www.parkgolf.or.kr',participants:'2,000명',lat:36.48,lng:127.289,distances:'36홀'},
  {id:60,title:'2026 전국마스터즈 배드민턴',sport:'배드민턴',icon:'🏸',venue:'수원 실내체육관',address:'경기 수원시 팔달구 효원로 241',start:'2026-10-12',end:'2026-10-15',status:'upcoming',region:'경기',desc:'전국 동호인 배드민턴 대회.',url:'https://www.badmintonkorea.org',participants:'2,000명',lat:37.2636,lng:127.0286,distances:'급수별 남녀단복식'},
  {id:61,title:'2026 소년체육대회',sport:'종합',icon:'🏅',venue:'광주 염주종합체육관',address:'광주 서구 금화로 240',start:'2026-10-14',end:'2026-10-19',status:'upcoming',region:'광주',desc:'전국 초·중학생 스포츠 축제.',url:'https://www.sports.or.kr',participants:'6,000명',lat:35.1495,lng:126.872,distances:'종합'},
  {id:63,title:'2026 경북 종별체육대회',sport:'종합',icon:'🏅',venue:'포항 스틸야드',address:'경북 포항시 북구 흥해읍 초곡길 12',start:'2026-10-21',end:'2026-10-26',status:'upcoming',region:'경북',desc:'경북 23개 시·군 스포츠 축제.',url:'https://www.sports.or.kr',participants:'6,000명',lat:36.1013,lng:129.3898,distances:'종합'},
  {id:64,title:'2026 경남 종별체육대회',sport:'종합',icon:'🏅',venue:'창원종합운동장',address:'경남 창원시 성산구 창원대로 691',start:'2026-11-04',end:'2026-11-09',status:'upcoming',region:'경남',desc:'경남 18개 시·군 스포츠 축제.',url:'https://www.sports.or.kr',participants:'6,000명',lat:35.2279,lng:128.6811,distances:'종합'},
  {id:65,title:'2026 충남 종별체육대회',sport:'종합',icon:'🏅',venue:'천안 종합운동장',address:'충남 천안시 서북구 쌍용동',start:'2026-11-04',end:'2026-11-09',status:'upcoming',region:'충남',desc:'충남 15개 시·군 스포츠 축제.',url:'https://www.sports.or.kr',participants:'4,000명',lat:36.8151,lng:127.1139,distances:'종합'},
  {id:66,title:'2026 제주 종별체육대회',sport:'종합',icon:'🏅',venue:'제주종합경기장',address:'제주 제주시 오라이동 1608',start:'2026-10-28',end:'2026-11-02',status:'upcoming',region:'제주',desc:'제주 2개 시 스포츠 축제.',url:'https://www.sports.or.kr',participants:'3,000명',lat:33.5007,lng:126.5237,distances:'종합'},
  {id:67,title:'2026 전국 생활체육 종합대회',sport:'종합',icon:'🏅',venue:'익산 실내체육관',address:'전북 익산시 인북로 120',start:'2026-11-11',end:'2026-11-16',status:'upcoming',region:'전북',desc:'전국 동호인 생활체육 종합 축제.',url:'https://www.sports.or.kr',participants:'20,000명',lat:35.9483,lng:126.9578,distances:'종합'},
  {id:68,title:'2026 전국 e스포츠선수권',sport:'기타',icon:'🎮',venue:'부산 벡스코',address:'부산 해운대구 APEC로 55',start:'2026-10-24',end:'2026-10-27',status:'upcoming',region:'부산',desc:'전국 e스포츠 선수권.',url:'https://www.esports.or.kr',participants:'10,000명',lat:35.1694,lng:129.1356,distances:'리그오브레전드·발로란트'},
  {id:69,title:'2026 전국 씨름왕선발대회',sport:'기타',icon:'🤼',venue:'영암 씨름경기장',address:'전남 영암군 삼호읍 나불리',start:'2026-10-17',end:'2026-10-20',status:'upcoming',region:'전남',desc:'전통 씨름 최강자 선발.',url:'https://www.ssireum.or.kr',participants:'1,000명',lat:34.7789,lng:126.4581,distances:'체급별·통합'},
  {id:70,title:'2026 전국인라인롤러선수권',sport:'기타',icon:'🛼',venue:'목동 스피드스케이팅경기장',address:'서울 양천구 신월동 222-1',start:'2026-10-16',end:'2026-10-18',status:'upcoming',region:'서울',desc:'전국 인라인 롤러 선수권.',url:'https://www.inlinekorea.or.kr',participants:'600명',lat:37.5289,lng:126.871,distances:'스피드·슬라럼'},
  {id:77,title:'2026 전국요트선수권',sport:'기타',icon:'⛵',venue:'통영 요트경기장',address:'경남 통영시 도산면 법송리',start:'2026-10-15',end:'2026-10-19',status:'upcoming',region:'경남',desc:'전국 요트 선수권.',url:'https://www.sports.or.kr',participants:'400명',lat:34.8544,lng:128.4331,distances:'레이저·470'},
  {id:78,title:'2026 전국승마선수권',sport:'기타',icon:'🏇',venue:'과천 경마공원 승마장',address:'경기 과천시 주암동 685',start:'2026-10-22',end:'2026-10-26',status:'upcoming',region:'경기',desc:'전국 승마 선수권.',url:'https://www.sports.or.kr',participants:'400명',lat:37.4303,lng:126.9887,distances:'마장마술·장애물'},
  {id:79,title:'2026 전국사이클 MTB선수권',sport:'사이클',icon:'🚴',venue:'원주 치악산 MTB 코스',address:'강원 원주시 판부면 서곡리',start:'2026-10-10',end:'2026-10-12',status:'upcoming',region:'강원',desc:'전국 MTB 산악자전거 선수권.',url:'https://www.koreacycling.or.kr',participants:'800명',lat:37.321,lng:127.8958,distances:'XC·다운힐'},
  {id:83,title:'2026 전국복싱선수권',sport:'기타',icon:'🥊',venue:'울산 동천체육관',address:'울산 중구 학산로 150',start:'2026-10-20',end:'2026-10-24',status:'upcoming',region:'울산',desc:'전국 복싱 최강자 선발전.',url:'https://www.kba.or.kr',participants:'500명',lat:35.5519,lng:129.3194,distances:'아마추어복싱'},
  {id:84,title:'2026 전국펜싱선수권',sport:'기타',icon:'🤺',venue:'진천 국가대표선수촌',address:'충북 진천군 덕산읍 국가대표로 400',start:'2026-10-12',end:'2026-10-16',status:'upcoming',region:'충북',desc:'전국 펜싱 남녀 선수권.',url:'https://www.sports.or.kr',participants:'600명',lat:36.8997,lng:127.4318,distances:'에페·플뢰레·사브르'},
  {id:85,title:'2026 전국추계육상경기대회',sport:'기타',icon:'🏃',venue:'울산 문수국제경기장',address:'울산 남구 문수로 44',start:'2026-10-16',end:'2026-10-18',status:'upcoming',region:'울산',desc:'전국 트랙&필드 추계 선수권.',url:'https://www.sports.or.kr',participants:'2,000명',lat:35.5396,lng:129.2665,distances:'트랙·필드·도로'},
  {id:86,title:'2026 한국오픈 스쿼시',sport:'기타',icon:'🎾',venue:'서울 스쿼시장',address:'서울 강남구 테헤란로 524',start:'2026-11-05',end:'2026-11-08',status:'upcoming',region:'서울',desc:'국제 스쿼시 오픈 대회.',url:'https://www.squash.or.kr',participants:'500명',lat:37.5104,lng:127.0627,distances:'남녀프로'},
  {id:87,title:'2026 전국 족구선수권',sport:'기타',icon:'⚽',venue:'천안 성환체육공원',address:'충남 천안시 서북구 성환읍',start:'2026-10-28',end:'2026-10-31',status:'upcoming',region:'충남',desc:'전국 족구 최강팀 가리기.',url:'https://www.sports.or.kr',participants:'3,000명',lat:36.9225,lng:127.1303,distances:'남녀팀전'},
  {id:88,title:'2026 전국 게이트볼선수권',sport:'기타',icon:'🏑',venue:'대구 게이트볼장',address:'대구 달서구 장기동 1000-1',start:'2026-10-21',end:'2026-10-24',status:'upcoming',region:'대구',desc:'전국 게이트볼 최강팀.',url:'https://www.sports.or.kr',participants:'2,000명',lat:35.8285,lng:128.5322,distances:'팀전'},
  {id:89,title:'2026 전국 그라운드골프선수권',sport:'기타',icon:'⛳',venue:'고령 그라운드골프장',address:'경북 고령군 대가야읍 지산리 215',start:'2026-11-04',end:'2026-11-07',status:'upcoming',region:'경북',desc:'전국 그라운드골프 선수권.',url:'https://www.sports.or.kr',participants:'1,500명',lat:35.7274,lng:128.2643,distances:'36홀'},
  {id:90,title:'2026 전국 풋살선수권',sport:'축구',icon:'⚽',venue:'부천 실내체육관',address:'경기 부천시 원미구 조마루로 340',start:'2026-10-28',end:'2026-11-01',status:'upcoming',region:'경기',desc:'전국 풋살 최강팀 결정전.',url:'https://www.kfa.or.kr',participants:'2,000명',lat:37.4989,lng:126.7819,distances:'남자팀전'},
  {id:91,title:'2026 전국궁도대회',sport:'기타',icon:'🏹',venue:'예천 활터',address:'경북 예천군 예천읍 백전리',start:'2026-10-10',end:'2026-10-12',status:'upcoming',region:'경북',desc:'전국 궁도인 화합의 장.',url:'https://www.gungdo.or.kr',participants:'2,000명',lat:36.6558,lng:128.2943,distances:'정간·원사'},
  {id:92,title:'2026 전국수상스키·웨이크보드',sport:'기타',icon:'🌊',venue:'충주호 수상레저',address:'충북 충주시 동량면 충주호수로',start:'2026-10-03',end:'2026-10-05',status:'upcoming',region:'충북',desc:'전국 수상스키·웨이크보드 선수권.',url:'https://www.sports.or.kr',participants:'400명',lat:37.009,lng:127.9852,distances:'수상스키·웨이크보드'},
  {id:93,title:'2026 전국 스쿼시선수권',sport:'기타',icon:'🎾',venue:'구리 스쿼시장',address:'경기 구리시 교문동 338',start:'2026-10-22',end:'2026-10-25',status:'upcoming',region:'경기',desc:'전국 스쿼시 남녀 최강자.',url:'https://www.squash.or.kr',participants:'800명',lat:37.5944,lng:127.1296,distances:'남녀단식'},
  {id:94,title:'2026 대한민국 휠체어마라톤',sport:'마라톤',icon:'♿',venue:'서울 마포구 일대',address:'서울 마포구 월드컵로 240',start:'2026-10-31',end:'2026-10-31',status:'upcoming',region:'서울',desc:'전국 휠체어 마라톤 선수권.',url:'https://www.kaaf.or.kr',participants:'500명',lat:37.5686,lng:126.8973,distances:'풀코스·하프'},
  {id:95,title:'2026 전국 카바디선수권',sport:'기타',icon:'🤼',venue:'천안 실내체육관',address:'충남 천안시 서북구 두정동 716',start:'2026-11-04',end:'2026-11-07',status:'upcoming',region:'충남',desc:'전국 카바디 남녀 선수권.',url:'https://www.sports.or.kr',participants:'600명',lat:36.8383,lng:127.1531,distances:'남녀팀전'},
  {id:98,title:'2026 전국 족구선수권 (여자부)',sport:'기타',icon:'⚽',venue:'인천 계양체육관',address:'인천 계양구 계양산로 90',start:'2026-11-12',end:'2026-11-15',status:'upcoming',region:'인천',desc:'전국 여자 족구 최강팀.',url:'https://www.sports.or.kr',participants:'1,000명',lat:37.537,lng:126.738,distances:'여자팀전'},
  {id:99,title:'2026 전국 씨름 왕중왕전',sport:'기타',icon:'🤼',venue:'전주 실내체육관',address:'전북 전주시 덕진구 팔달로 350',start:'2026-11-21',end:'2026-11-22',status:'upcoming',region:'전북',desc:'천하·한라·백두·금강 장사 왕중왕전.',url:'https://www.ssireum.or.kr',participants:'2,000명',lat:35.8234,lng:127.1289,distances:'왕중왕전'},
  {id:100,title:'2026 전국복지체육대회',sport:'종합',icon:'🏅',venue:'대구 달서구 실내체육관',address:'대구 달서구 두류공원로 200',start:'2026-11-11',end:'2026-11-15',status:'upcoming',region:'대구',desc:'사회복지 종사자 스포츠 축제.',url:'https://www.sports.or.kr',participants:'3,000명',lat:35.8666,lng:128.5644,distances:'종합'},
  {id:103,title:'2026 전국 인라인마라톤',sport:'마라톤',icon:'🛼',venue:'서울 한강공원',address:'서울 영등포구 여의도 한강공원',start:'2026-10-31',end:'2026-10-31',status:'upcoming',region:'서울',desc:'인라인 스케이트로 달리는 마라톤.',url:'https://www.kaaf.or.kr',participants:'5,000명',lat:37.5289,lng:126.9328,distances:'하프·10K'},
  {id:149,title:'2026 강릉 신한동해오픈 골프',sport:'골프',icon:'⛳',venue:'강릉 스카이밸리CC',address:'강원 강릉',start:'2026-10-15',end:'2026-10-18',status:'upcoming',region:'강원',desc:'2026 강릉 신한동해오픈 골프. 강원 강릉 개최.',url:'https://www.kgto.co.kr',participants:'500명',lat:37.738,lng:128.865,distances:'72홀 스트로크'},
  {id:169,title:'2026 서울 레이디스 마라톤',sport:'마라톤',icon:'🏃',venue:'여의도 한강공원',address:'서울 마포',start:'2026-10-31',end:'2026-10-31',status:'upcoming',region:'서울',desc:'2026 서울 레이디스 마라톤. 서울 마포 개최.',url:'https://www.ladiesmarathon.or.kr',participants:'8,000명',lat:37.529,lng:126.933,distances:'하프·10K'},
  {id:174,title:'2026 전국실업배드민턴선수권',sport:'배드민턴',icon:'🏸',venue:'인천 계양체육관',address:'인천 계양',start:'2026-10-05',end:'2026-10-10',status:'upcoming',region:'인천',desc:'2026 전국실업배드민턴선수권. 인천 계양 개최.',url:'https://www.badmintonkorea.org',participants:'500명',lat:37.537,lng:126.738,distances:'남녀단복식'},
  {id:176,title:'2026 전국 탁구선수권',sport:'기타',icon:'🏆',venue:'대전 충무체육관',address:'대전 중구',start:'2026-10-14',end:'2026-10-18',status:'upcoming',region:'대전',desc:'2026 전국 탁구선수권. 대전 중구 개최.',url:'https://www.tabletennis.or.kr',participants:'1,500명',lat:36.322,lng:127.421,distances:'남녀단복식'},
  {id:181,title:'2026 전국 볼링대회',sport:'기타',icon:'🏆',venue:'성남 볼링장',address:'경기 성남',start:'2026-10-22',end:'2026-10-25',status:'upcoming',region:'경기',desc:'2026 전국 볼링대회. 경기 성남 개최.',url:'https://www.sports.or.kr',participants:'1,000명',lat:37.384,lng:127.122,distances:'남녀일반부'},
  {id:186,title:'2026 서울마라톤 가을대회',sport:'마라톤',icon:'🏃',venue:'광화문광장',address:'서울 종로',start:'2026-11-01',end:'2026-11-01',status:'upcoming',region:'서울',desc:'2026 서울마라톤 가을대회. 서울 종로 개최.',url:'http://marathon.jtbc.com',participants:'15,000명',lat:37.572,lng:126.977,distances:'풀코스·하프'},
  {id:191,title:'2026 전국 시군구 마라톤',sport:'마라톤',icon:'🏃',venue:'대전 엑스포 시민광장',address:'대전 유성',start:'2026-11-08',end:'2026-11-08',status:'upcoming',region:'대전',desc:'2026 전국 시군구 마라톤. 대전 유성 개최.',url:'https://www.kaaf.or.kr',participants:'15,000명',lat:36.374,lng:127.388,distances:'풀코스·하프'},
  {id:194,title:'2026 국제태권도대회',sport:'태권도',icon:'🥋',venue:'서울 올림픽체조경기장',address:'서울 송파',start:'2026-11-05',end:'2026-11-08',status:'upcoming',region:'서울',desc:'2026 국제태권도대회. 서울 송파 개최.',url:'https://www.worldtaekwondo.org',participants:'2,000명',lat:37.519,lng:127.127,distances:'품새·겨루기'},
  {id:196,title:'2026 전국 시각장애인 스포츠',sport:'종합',icon:'🏅',venue:'전주 실내체육관',address:'전북 전주',start:'2026-11-11',end:'2026-11-15',status:'upcoming',region:'전북',desc:'2026 전국 시각장애인 스포츠. 전북 전주 개최.',url:'https://www.sports.or.kr',participants:'1,000명',lat:35.823,lng:127.129,distances:'종합'},
  {id:208,title:'2026 전국 복지체육대회',sport:'종합',icon:'🏅',venue:'대구 달서구 실내체육관',address:'대구 달서',start:'2026-11-11',end:'2026-11-15',status:'upcoming',region:'대구',desc:'2026 전국 복지체육대회. 대구 달서 개최.',url:'https://www.sports.or.kr',participants:'3,000명',lat:35.867,lng:128.564,distances:'종합'},
  {id:212,title:'2026 제주 감귤 그란폰도',sport:'사이클',icon:'🚴',venue:'서귀포 월드컵경기장',address:'제주 서귀포',start:'2026-12-05',end:'2026-12-06',status:'upcoming',region:'제주',desc:'2026 제주 감귤 그란폰도. 제주 서귀포 개최.',url:'https://www.koreacycling.or.kr',participants:'1,500명',lat:33.246,lng:126.509,distances:'110km·60km'},
  {id:213,title:'2026 대구 실내 배드민턴 오픈',sport:'배드민턴',icon:'🏸',venue:'대구체육관',address:'대구 수성',start:'2026-12-05',end:'2026-12-06',status:'upcoming',region:'대구',desc:'2026 대구 실내 배드민턴 오픈. 대구 수성 개최.',url:'https://www.badmintonkorea.org',participants:'1,000명',lat:35.83,lng:128.61,distances:'복식'},
  {id:214,title:'2026 전국 마스터즈 마라톤',sport:'마라톤',icon:'🏃',venue:'광화문광장',address:'서울 종로',start:'2026-12-06',end:'2026-12-06',status:'upcoming',region:'서울',desc:'2026 전국 마스터즈 마라톤. 서울 종로 개최.',url:'https://www.kaaf.or.kr',participants:'8,000명',lat:37.572,lng:126.977,distances:'하프·10K'},
  {id:215,title:'2026 겨울 경주 마라톤',sport:'마라톤',icon:'🏃',venue:'경주시민운동장',address:'경북 경주',start:'2026-12-13',end:'2026-12-13',status:'upcoming',region:'경북',desc:'2026 겨울 경주 마라톤. 경북 경주 개최.',url:'https://www.kaaf.or.kr',participants:'5,000명',lat:35.856,lng:129.225,distances:'하프·10K'},
  {id:216,title:'2026 전국 실내 자전거 경기',sport:'사이클',icon:'🚴',venue:'광명 스피돔',address:'경기 광명',start:'2026-12-12',end:'2026-12-13',status:'upcoming',region:'경기',desc:'2026 전국 실내 자전거 경기. 경기 광명 개최.',url:'https://www.koreacycling.or.kr',participants:'400명',lat:37.44,lng:126.856,distances:'트랙'},
  {id:217,title:'2026 무등산 스카이 트레일',sport:'트레일',icon:'🏆',venue:'무등산국립공원 증심사',address:'광주 동구',start:'2026-12-05',end:'2026-12-06',status:'upcoming',region:'광주',desc:'2026 무등산 스카이 트레일. 광주 동구 개최.',url:'https://www.trail.or.kr',participants:'700명',lat:35.128,lng:126.988,distances:'25km·12km'},
  {id:218,title:'2026 한겨울 부산 해변 러닝',sport:'러닝',icon:'💨',venue:'해운대해수욕장',address:'부산 해운대',start:'2026-12-12',end:'2026-12-12',status:'upcoming',region:'부산',desc:'2026 한겨울 부산 해변 러닝. 부산 해운대 개최.',url:'https://www.kaaf.or.kr',participants:'3,000명',lat:35.159,lng:129.16,distances:'10K·5K'},
  {id:220,title:'2026 겨울 배드민턴 클럽 리그',sport:'배드민턴',icon:'🏸',venue:'서울 실내체육관',address:'서울 강남',start:'2026-12-06',end:'2026-12-07',status:'upcoming',region:'서울',desc:'2026 겨울 배드민턴 클럽 리그. 서울 강남 개최.',url:'https://www.badmintonkorea.org',participants:'600명',lat:37.51,lng:127.03,distances:'복식'},
  {id:221,title:'2026 전국 볼링 왕중왕전',sport:'기타',icon:'🏆',venue:'성남 볼링장',address:'경기 성남',start:'2026-12-06',end:'2026-12-07',status:'upcoming',region:'경기',desc:'2026 전국 볼링 왕중왕전. 경기 성남 개최.',url:'https://www.sports.or.kr',participants:'500명',lat:37.384,lng:127.122,distances:'남녀결선'},
  {id:222,title:'2026 연말 서울 마라톤 파티런',sport:'마라톤',icon:'🏃',venue:'홍대입구 일대',address:'서울 마포',start:'2026-12-27',end:'2026-12-27',status:'upcoming',region:'서울',desc:'2026 연말 서울 마라톤 파티런. 서울 마포 개최.',url:'https://www.kaaf.or.kr',participants:'5,000명',lat:37.557,lng:126.924,distances:'10K·5K'},
  {id:223,title:'2026 연말 5K 달리기 축제',sport:'러닝',icon:'💨',venue:'일산 호수공원',address:'경기 고양',start:'2026-12-20',end:'2026-12-20',status:'upcoming',region:'경기',desc:'2026 연말 5K 달리기 축제. 경기 고양 개최.',url:'https://www.kaaf.or.kr',participants:'3,000명',lat:37.674,lng:126.762,distances:'5K'},
  {id:224,title:'2026 겨울 전국 수영 오픈',sport:'수영',icon:'🏊',venue:'워커힐 실내수영장',address:'서울 광진',start:'2026-12-13',end:'2026-12-14',status:'upcoming',region:'서울',desc:'2026 겨울 전국 수영 오픈. 서울 광진 개최.',url:'https://www.swimming.or.kr',participants:'600명',lat:37.545,lng:127.08,distances:'자유형·개인혼영'},
  {id:225,title:'2026 연말 자전거 퍼레이드',sport:'사이클',icon:'🚴',venue:'서울 자전거 도로',address:'서울 마포',start:'2026-12-27',end:'2026-12-27',status:'upcoming',region:'서울',desc:'2026 연말 자전거 퍼레이드. 서울 마포 개최.',url:'https://www.koreacycling.or.kr',participants:'2,000명',lat:37.557,lng:126.924,distances:'퍼레이드'},
  {id:226,title:'2026 설 맞이 전국 씨름',sport:'기타',icon:'🏆',venue:'충주 세계무술공원',address:'충북 충주',start:'2026-12-19',end:'2026-12-20',status:'upcoming',region:'충북',desc:'2026 설 맞이 전국 씨름. 충북 충주 개최.',url:'https://www.sports.or.kr',participants:'800명',lat:36.96,lng:127.89,distances:'체급별'},
];

// ── 런타임 날짜 기준 동적 status 갱신 ──
// 빌드 타임 status는 참고용, 실제 렌더링 시 이 함수로 재계산
export function getDynamicEvents() {
  return EVENTS.map(e => ({
    ...e,
    status: calcStatus(e.start, e.end),
    dday: calcDday(e.start),
  }));
}

// 지난 대회 포함 전체 (캘린더용)
export function getAllEvents() {
  return EVENTS.map(e => ({
    ...e,
    status: calcStatus(e.start, e.end),
    dday: calcDday(e.start),
  }));
}
