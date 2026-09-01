import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '저장한 대회 | 스포트립',
  description: '하트로 저장한 스포츠 대회 목록을 확인하세요.',
  robots: { index: false, follow: false }, // 개인 목록 — 검색 색인 불필요
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
