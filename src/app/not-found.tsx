import Link from 'next/link';
import { Header } from '@/components/layout/Header';

export default function NotFound() {
  return (
    <>
      <Header/>
      <main className="max-w-[1760px] mx-auto px-5 md:px-10 py-24 text-center">
        <div className="text-[80px] font-black text-[#EBEBEB] leading-none mb-4">404</div>
        <h1 className="text-[24px] font-extrabold text-[#222] mb-2">페이지를 찾을 수 없어요</h1>
        <p className="text-[15px] text-[#717171] mb-8">
          요청하신 대회 또는 페이지가 삭제되었거나 존재하지 않습니다.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/events"
            className="px-6 py-3 bg-[#0B5C43] text-white font-bold rounded-xl text-[15px] hover:bg-[#083D2D] transition-colors">
            대회 목록으로
          </Link>
          <Link href="/"
            className="px-6 py-3 border-2 border-[#EBEBEB] text-[#333] font-bold rounded-xl text-[15px] hover:border-[#0B5C43] transition-colors">
            홈으로
          </Link>
        </div>
      </main>
    </>
  );
}
