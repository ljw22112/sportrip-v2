import {
  Trophy, Search, Map, Compass, CalendarDays, Navigation, Heart,
  Landmark, Globe, Zap, FileCode2, Palette, MapPinned, TentTree,
  Rocket, Bot, Megaphone, Handshake, Star, ExternalLink, Bookmark,
  PartyPopper, Drama, UtensilsCrossed, BedDouble, CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP = {
  contest: Trophy,
  findEvent: Search,
  mapExplore: Map,
  travelInfo: Compass,
  calendar: CalendarDays,
  directions: Navigation,
  save: Heart,
  publicData: Landmark,
  tourOrg: Globe,
  nextjs: Zap,
  typescript: FileCode2,
  tailwind: Palette,
  kakaoMap: MapPinned,
  tourApi: TentTree,
  vercel: Rocket,
  automation: Bot,
  organizer: Megaphone,
  partnership: Handshake,
  premium: Star,
  external: ExternalLink,
  saved: Bookmark,
  festival: PartyPopper,
  culture: Drama,
  food: UtensilsCrossed,
  stay: BedDouble,
  check: CheckCircle2,
} as const;

export type IconName = keyof typeof ICON_MAP;

interface SportripIconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function SportripIcon({ name, size=20, className, strokeWidth=1.75 }: SportripIconProps) {
  const Icon: LucideIcon = ICON_MAP[name];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true"/>;
}

const TILE_TONES = {
  brand: 'bg-[#E7F1EC] text-[#0B5C43]',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose:  'bg-rose-50 text-rose-500',
  slate: 'bg-slate-100 text-slate-600',
  lime:  'bg-[#F2FBD2] text-[#4A6A0A]',
} as const;

interface IconTileProps { name: IconName; tone?: keyof typeof TILE_TONES; size?: number; }

export function IconTile({ name, tone='brand', size=26 }: IconTileProps) {
  return (
    <div className={`inline-flex items-center justify-center rounded-2xl ${TILE_TONES[tone]}`}
      style={{width: size*2.15, height: size*2.15}}>
      <SportripIcon name={name} size={size}/>
    </div>
  );
}

interface SaveHeartProps { saved: boolean; onToggle: () => void; size?: number; }

export function SaveHeart({ saved, onToggle, size=22 }: SaveHeartProps) {
  return (
    <button type="button" onClick={onToggle}
      aria-label={saved ? '저장 취소' : '대회 저장'} aria-pressed={saved}
      className="group inline-flex items-center justify-center p-1.5 rounded-full transition-transform active:scale-90">
      <Heart size={size} strokeWidth={1.75}
        className={saved
          ? 'fill-rose-500 text-rose-500 transition-colors'
          : 'fill-transparent text-slate-400 group-hover:text-rose-400 transition-colors'}/>
    </button>
  );
}
