'use client';
interface Props { url: string; title: string; className?: string; }
export function ShareButton({ url, title, className }: Props) {
  const share = () => {
    const full = `${window.location.origin}${url}`;
    if (navigator.share) { navigator.share({ title, url: full }); }
    else { navigator.clipboard.writeText(full); alert('링크가 복사됐습니다!'); }
  };
  return (
    <button onClick={share}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] border-2 border-[#EBEBEB] hover:border-[#222] transition-colors ${className}`}>
      🔗 공유하기
    </button>
  );
}
