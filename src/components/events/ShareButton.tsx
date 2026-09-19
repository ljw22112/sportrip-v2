'use client';
import { useState } from 'react';

interface Props { url: string; title: string; className?: string; }

export function ShareButton({ url, title, className }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const full = `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(full);
    } catch {
      const el = document.createElement('input');
      el.value = full; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] border-2 transition-all ${
        copied
          ? 'border-green-500 text-green-600 bg-green-50'
          : 'border-border hover:border-[#222]'
      } ${className}`}>
      {copied ? '✓ 링크 복사됨' : '🔗 링크 복사'}
    </button>
  );
}
