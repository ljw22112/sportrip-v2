'use client';
export function BackButton() {
  return (
    <button onClick={() => window.history.back()}
      className="flex items-center gap-1.5 text-[14px] text-[#717171] hover:text-[#222] transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      뒤로
    </button>
  );
}
