import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대회 일정 | 스포트립',
  description: '전국 130개 이상의 스포츠 대회를 종목·지역·날짜로 검색하세요. 마라톤, 배드민턴, 수영 등 15개 종목 대회 일정.',
  openGraph: {
    title: '전국 스포츠 대회 일정 | 스포트립',
    description: '마라톤·배드민턴·수영 등 전국 대회 일정과 개최지 주변 관광 정보를 한번에.',
    images: [{ url: 'https://www.sportrip.co.kr/og-image.png', width: 1200, height: 630 }],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
