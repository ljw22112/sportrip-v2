import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/context/UserContext';

export const metadata: Metadata = {
  title: '스포트립 — 대회를 고르면, 코스는 AI가',
  description: '전국 스포츠 대회 일정과 개최지 주변 관광·맛집·숙소, 같은 기간 열리는 지역 축제까지 한곳에서.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
