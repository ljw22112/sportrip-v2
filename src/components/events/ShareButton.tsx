'use client';
import { useState } from 'react';

export function ShareButton({ full = false }: { full?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      alert('주소창의 링크를 복사해 공유해 주세요.');
    }
  };

  if (full) {
    return (
      <button onClick={handleShare}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid var(--line)', borderRadius: 12, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: '#fff', fontFamily: 'inherit', color: 'var(--ink)', transition: 'background .15s' }}>
        {copied ? '✅ 링크 복사됨!' : '일행에게 공유'}
      </button>
    );
  }

  return (
    <button onClick={handleShare}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, padding: '7px 10px', borderRadius: 8, border: 0, background: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2, fontFamily: 'inherit' }}>
      {copied ? '✅ 복사됨' : '공유'}
    </button>
  );
}
