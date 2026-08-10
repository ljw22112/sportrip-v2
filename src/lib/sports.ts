export const SPORTS_15 = [
  { key:'전체',    label:'전체',    emoji:'🌐', color:'#555',     icon:'/icons/all.svg' },
  { key:'마라톤',  label:'마라톤',  emoji:'🏃', color:'#E4572E',  icon:'/icons/marathon.png' },
  { key:'러닝',    label:'러닝',    emoji:'💨', color:'#E8720C',  icon:'/icons/running.png' },
  { key:'사이클',  label:'사이클',  emoji:'🚴', color:'#2E86C1',  icon:'/icons/cycling.png' },
  { key:'축구',    label:'축구',    emoji:'⚽', color:'#27AE60',  icon:'/icons/soccer.png' },
  { key:'배드민턴',label:'배드민턴',emoji:'🏸', color:'#8E44AD',  icon:'/icons/badminton.png' },
  { key:'수영',    label:'수영',    emoji:'🏊', color:'#2980B9',  icon:'/icons/swimming.png' },
  { key:'테니스',  label:'테니스',  emoji:'🎾', color:'#D4AC0D',  icon:'/icons/tennis.png' },
  { key:'트레일',  label:'트레일',  emoji:'🏔️', color:'#1E8449', icon:'/icons/trail.svg' },
  { key:'농구',    label:'농구',    emoji:'🏀', color:'#CA6F1E',  icon:'/icons/basketball.png' },
  { key:'배구',    label:'배구',    emoji:'🏐', color:'#7D3C98',  icon:'/icons/volleyball.png' },
  { key:'야구',    label:'야구',    emoji:'⚾', color:'#1A5276',  icon:'/icons/baseball.png' },
  { key:'태권도',  label:'태권도',  emoji:'🥋', color:'#922B21',  icon:'/icons/taekwondo.png' },
  { key:'골프',    label:'골프',    emoji:'⛳', color:'#1E8449',  icon:'/icons/golf.png' },
  { key:'종합',    label:'종합',    emoji:'🏅', color:'#B7950B',  icon:'/icons/multi.png' },
  { key:'기타',    label:'기타',    emoji:'🏆', color:'#616A6B',  icon:'/icons/etc.png' },
];

export function getSportInfo(key: string) {
  return SPORTS_15.find(s => s.key === key) || SPORTS_15[SPORTS_15.length - 1];
}

export const SPORT_KEYS = SPORTS_15.map(s => s.key);
