import { getSportInfo } from '@/lib/sports';

interface Props {
  sport: string;
  className?: string;
  emojiClassName?: string;
}

/** 종목 캐릭터 이미지(있으면) 또는 이모지 폴백을 렌더링 */
export function SportIcon({ sport, className = 'h-full w-full object-contain', emojiClassName = '' }: Props) {
  const info = getSportInfo(sport);
  if (info.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={info.icon} alt={info.label} className={className} draggable={false} />
    );
  }
  return <span className={emojiClassName}>{info.emoji}</span>;
}
