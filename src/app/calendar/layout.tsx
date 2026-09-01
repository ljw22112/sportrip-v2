import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대회 캘린더 | 스포트립',
  description: '월별 전국 스포츠 대회 일정을 캘린더로 확인하세요. 종목 필터로 원하는 대회만 골라볼 수 있습니다.',
  openGraph: {
    title: '대회 캘린더 | 스포트립',
    description: '전국 스포츠 대회 월간 캘린더 — 마라톤·수영·배드민턴 등 15개 종목.',
    images: [{ url: 'https://www.sportrip.co.kr/og-image.png', width: 1200, height: 630 }],
  },
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
