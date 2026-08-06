import type{Metadata}from'next';
import'./globals.css';
import{Header}from'@/components/layout/Header';
import{UserProvider}from'@/context/UserContext';

export const metadata:Metadata={
  title:'스포트립 — 전국 스포츠 대회 한눈에',
  description:'전국 스포츠 대회 일정을 한눈에. 지역·종목별 필터로 내 다음 대회를 찾아보세요.',
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html lang="ko">
      <body>
        <UserProvider>
          <Header/>
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-[#EBEBEB] py-10 mt-16">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="font-bold text-lg text-[#222222] mb-1">⚽ 스포<span className="text-[#FF5722]">트립</span></div>
                  <p className="text-xs text-[#717171]">전국 스포츠 대회 정보 플랫폼</p>
                </div>
                <div className="text-xs text-[#717171] space-y-1">
                  <p>관광 데이터: 한국관광공사 TourAPI · 공공데이터포털</p>
                  <p>© 2026 SpoTrip · 2026 관광데이터 활용 공모전 출품작</p>
                </div>
              </div>
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
