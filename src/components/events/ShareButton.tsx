'use client';
import { useState } from 'react';

interface Props { url: string; title: string; className?: string; }

export function ShareButton({ url, title, className }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${url}`
    : `https://www.sportrip.co.kr${url}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(fullUrl); }
    catch {
      const el = document.createElement('input');
      el.value = fullUrl; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 모바일 네이티브 공유 (카카오톡 포함)
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
        setOpen(false);
      } catch {}
    } else {
      copy();
    }
  };

  const shareX = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] border-2 border-border hover:border-[#222] transition-all ${className}`}>
        🔗 공유하기
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40"/>
          <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-sm p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-[18px] font-black text-center mb-1">공유하기</h3>
            <p className="text-[13px] text-muted text-center mb-5">SNS로 공유하세요</p>

            {/* 링크 */}
            <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-xl px-3 py-2.5 mb-5">
              <span className="text-[12px] text-muted truncate flex-1">{fullUrl}</span>
              <button onClick={copy}
                className={`flex-shrink-0 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-[#0F0F0F] text-white'}`}>
                {copied ? '✓ 복사됨' : '복사'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <button onClick={copy}
                className="flex flex-col items-center gap-2 py-3 rounded-xl bg-[#F5F5F5] hover:bg-[#E5E5E5] transition-all">
                <span className="text-2xl">🔗</span>
                <span className="text-[12px] font-semibold">링크 복사</span>
              </button>
              {/* 카카오 — 모바일 네이티브 공유 시트 사용 */}
              <button onClick={nativeShare}
                className="flex flex-col items-center gap-2 py-3 rounded-xl hover:opacity-80 transition-all" style={{background:'#FEE500'}}>
                <span className="text-2xl">💬</span>
                <span className="text-[12px] font-semibold text-[#3C1E1E]">카카오톡</span>
              </button>
              <button onClick={shareX}
                className="flex flex-col items-center gap-2 py-3 rounded-xl bg-black hover:opacity-80 transition-all">
                <span className="text-2xl text-white">𝕏</span>
                <span className="text-[12px] font-semibold text-white">X(트위터)</span>
              </button>
            </div>

            <button onClick={() => setOpen(false)}
              className="w-full py-3 rounded-xl bg-[#F5F5F5] font-semibold text-[14px] hover:bg-[#E5E5E5] transition-all">
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
