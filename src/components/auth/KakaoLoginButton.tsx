'use client';
import { useEffect, useState } from 'react';

declare global { interface Window { Kakao: any; } }

const KAKAO_JS_KEY = 'ea0bac9cb1bcae92ec228bcd1bbed72f';

export function KakaoLoginButton({ onLogin }: { onLogin?: (user: any) => void }) {
  const [user, setUser] = useState<{nickname:string;thumbnail:string}|null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 카카오 SDK 로드
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
      setReady(true);
      // 이미 로그인된 사용자 확인
      try {
        const saved = localStorage.getItem('sportrip_kakao_user');
        if (saved) setUser(JSON.parse(saved));
      } catch {}
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    s.onload = () => {
      window.Kakao.init(KAKAO_JS_KEY);
      setReady(true);
      try {
        const saved = localStorage.getItem('sportrip_kakao_user');
        if (saved) setUser(JSON.parse(saved));
      } catch {}
    };
    document.head.appendChild(s);
  }, []);

  function login() {
    if (!window.Kakao?.isInitialized()) return;
    window.Kakao.Auth.login({
      success: () => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: any) => {
            const profile = res.kakao_account?.profile;
            const u = { nickname: profile?.nickname || '스포터', thumbnail: profile?.thumbnail_image_url || '' };
            setUser(u);
            localStorage.setItem('sportrip_kakao_user', JSON.stringify(u));
            onLogin?.(u);
          },
        });
      },
      fail: (err: any) => console.error('카카오 로그인 실패', err),
    });
  }

  function logout() {
    window.Kakao?.Auth?.logout?.(() => {});
    setUser(null);
    localStorage.removeItem('sportrip_kakao_user');
  }

  if (!ready) return null;

  if (user) return (
    <div className="flex items-center gap-2">
      {user.thumbnail && <img src={user.thumbnail} alt={user.nickname} className="w-7 h-7 rounded-full"/>}
      <span className="text-[13px] font-bold">{user.nickname}</span>
      <button onClick={logout} className="text-[12px] text-muted hover:text-ink px-2 py-0.5 rounded-lg border border-border">로그아웃</button>
    </div>
  );

  return (
    <button onClick={login}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] transition-all hover:opacity-90"
      style={{background:'#FEE500',color:'#3C1E1E'}}>
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M9 1C4.582 1 1 3.91 1 7.5c0 2.302 1.523 4.32 3.817 5.475L3.75 17l4.428-2.916A9.97 9.97 0 0 0 9 14c4.418 0 8-2.91 8-6.5S13.418 1 9 1z" fill="#3C1E1E"/>
      </svg>
      카카오로 시작하기
    </button>
  );
}
