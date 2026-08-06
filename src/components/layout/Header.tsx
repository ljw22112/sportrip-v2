'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1120px] mx-auto px-5 h-14 flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="SpoTrip" width={120} height={32} priority />
            <span className="text-[10px] font-bold bg-[#E8F5E9] text-[#1A3A2A] px-1.5 py-0.5 rounded-full tracking-wider">BETA</span>
          </Link>
          {/* 저장한 대회 */}
          <Link href="/events" className="flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A] hover:text-[#1A3A2A] transition-colors">
            <Heart className="w-4 h-4" />
            저장한 대회
          </Link>
        </div>
      </header>
      <div className="h-14" />
    </>
  );
}
