/**
 * 대회별 관광코스 데이터
 * 타입: activity(액티비티) | food(먹거리) | attraction(역사·관광지) | festival(축제)
 */
import { SpotType } from './qlearning';

export interface CourseSpot {
  name: string;
  type: SpotType;
  icon: string;
  addr: string;
  tel?: string;
  note: string;
  duration: number;   // 분
  dist?: number;      // 경기장에서 거리(m)
  visitkoreaId?: string;
}

export interface Festival {
  name: string;
  addr: string;
  startDate: string;
  endDate: string;
  note: string;
  icon: string;
}

export interface EventCourse {
  dayBefore: CourseSpot[];
  dayOf: CourseSpot[];
  dayAfter: CourseSpot[];
  festivals: Festival[];
}

// ── 지역별 기본 코스 (대회 id 없는 경우 fallback) ──
export const REGION_COURSES: Record<string, EventCourse> = {
  서울: {
    dayBefore: [
      { name: '경복궁', type: 'attraction', icon: '🏯', addr: '서울 종로구 사직로 161', tel: '02-3700-3900', note: '조선 최대 법궁. 야간개장 시즌엔 특히 아름다워요.', duration: 90, dist: 3000 },
      { name: '북촌한옥마을', type: 'attraction', icon: '🏘️', addr: '서울 종로구 계동길 37', note: '전통 한옥이 즐비한 서울의 대표 골목.', duration: 60, dist: 3200 },
      { name: '광장시장 육회·빈대떡', type: 'food', icon: '🥘', addr: '서울 종로구 창경궁로 88', note: '100년 전통 시장. 육회비빔밥과 빈대떡이 유명.', duration: 60, dist: 2800 },
      { name: '삼청동 카페거리', type: 'activity', icon: '☕', addr: '서울 종로구 삼청로 일대', note: '갤러리와 카페가 어우러진 감성 거리.', duration: 60, dist: 3100 },
      { name: '인사동 쌈지길', type: 'activity', icon: '🛍️', addr: '서울 종로구 인사동길 44', note: '공예·전통 기념품 쇼핑 명소.', duration: 45, dist: 2500 },
      { name: '남산돈까스', type: 'food', icon: '🍱', addr: '서울 용산구 소월로 일대', note: '남산 인근 현지인 맛집 골목.', duration: 60, dist: 4000 },
    ],
    dayOf: [
      { name: '한강공원 피크닉', type: 'activity', icon: '🌊', addr: '서울 영등포구 여의도 한강공원', note: '대회 완주 후 한강에서 여유로운 휴식.', duration: 90, dist: 4500 },
      { name: '을지로 뉴트로 거리', type: 'activity', icon: '🎨', addr: '서울 중구 을지로 일대', note: '레트로 감성의 인쇄골목·힙한 카페.', duration: 60, dist: 2000 },
      { name: '설렁탕 원조 골목', type: 'food', icon: '🍲', addr: '서울 중구 명동 일대', note: '완주 후 뜨끈한 설렁탕으로 보양.', duration: 60, dist: 2200 },
      { name: '명동 먹거리 골목', type: 'food', icon: '🍢', addr: '서울 중구 명동길 일대', note: '다양한 길거리 음식을 한 번에.', duration: 45, dist: 2300 },
    ],
    dayAfter: [
      { name: '창덕궁 후원', type: 'attraction', icon: '🌿', addr: '서울 종로구 율곡로 99', tel: '02-3668-2300', note: '유네스코 세계문화유산. 비원 투어 필수.', duration: 120, dist: 3000 },
      { name: '국립중앙박물관', type: 'attraction', icon: '🏛️', addr: '서울 용산구 서빙고로 137', tel: '02-2077-9000', note: '한국 역사를 한눈에. 무료 입장.', duration: 120, dist: 5000 },
      { name: '이태원 세계음식거리', type: 'food', icon: '🌮', addr: '서울 용산구 이태원로 일대', note: '다양한 세계 음식 체험.', duration: 90, dist: 4800 },
      { name: '홍대 클래식 공연', type: 'activity', icon: '🎵', addr: '서울 마포구 홍대입구역 일대', note: '거리 버스킹과 갤러리 탐방.', duration: 90, dist: 6000 },
    ],
    festivals: [
      { name: '서울 빛초롱 축제', addr: '서울 청계천 일대', startDate: '2026-10-01', endDate: '2026-11-30', note: '청계천을 수놓는 LED 등불 축제', icon: '🏮' },
      { name: '서울 억새 축제', addr: '서울 하늘공원', startDate: '2026-10-15', endDate: '2026-10-31', note: '하늘공원 억새밭 황금빛 물결', icon: '🌾' },
    ],
  },
  부산: {
    dayBefore: [
      { name: '해운대 해수욕장', type: 'attraction', icon: '🏖️', addr: '부산 해운대구 해운대해변로 264', note: '국내 최고 해수욕장. 가을엔 한산하고 아름다워요.', duration: 90, dist: 8000 },
      { name: '감천문화마을', type: 'attraction', icon: '🎨', addr: '부산 사하구 감내2로 203', note: '부산의 산토리니. 다채로운 벽화와 골목 탐방.', duration: 90, dist: 5000 },
      { name: '자갈치시장 회', type: 'food', icon: '🐟', addr: '부산 중구 자갈치해안로 52', note: '부산 최대 수산시장. 활어회 한 접시 필수.', duration: 90, dist: 6000 },
      { name: '밀면 원조', type: 'food', icon: '🍜', addr: '부산 동구 초량상로 97', note: '부산만의 향토 음식. 냉면과는 다른 쫄깃한 맛.', duration: 60, dist: 7000 },
      { name: '광안대교 야경', type: 'activity', icon: '🌉', addr: '부산 수영구 광안해변로', note: '대회 코스에서도 보이는 광안대교 야경 명소.', duration: 60, dist: 2000 },
    ],
    dayOf: [
      { name: '대회 완주 후 돼지국밥', type: 'food', icon: '🍲', addr: '부산 부산진구 서면 일대', note: '완주 후 뜨끈한 부산 돼지국밥으로 체력 보충.', duration: 60, dist: 5000 },
      { name: 'BIFF 광장', type: 'activity', icon: '🎬', addr: '부산 중구 남포동 BIFF광장', note: '부산국제영화제가 열리는 명소. 핸드프린팅 명판.', duration: 45, dist: 6500 },
      { name: '부산역 차이나타운', type: 'activity', icon: '🏮', addr: '부산 동구 초량동 차이나타운', note: '이국적인 분위기의 역사 거리.', duration: 45, dist: 7200 },
    ],
    dayAfter: [
      { name: '태종대 유원지', type: 'attraction', icon: '🌊', addr: '부산 영도구 전망로 24', note: '부산 최남단 절경. 영도다리와 함께 부산 대표 명소.', duration: 120, dist: 8000 },
      { name: '국립일제강제동원역사관', type: 'attraction', icon: '🏛️', addr: '부산 남구 홍곡로 320번길 100', note: '역사를 기억하는 공간. 무료 입장.', duration: 60, dist: 5000 },
      { name: '기장 멸치회', type: 'food', icon: '🐟', addr: '부산 기장군 기장읍 대변리', note: '기장 명물 생멸치회. 특별한 경험.', duration: 90, dist: 15000 },
      { name: '송정 서핑', type: 'activity', icon: '🏄', addr: '부산 해운대구 송정해수욕장', note: '부산 서핑 명소. 초보자 강습도 가능.', duration: 120, dist: 5000 },
    ],
    festivals: [
      { name: '부산 불꽃 축제', addr: '부산 광안리해수욕장', startDate: '2026-10-04', endDate: '2026-10-04', note: '국내 최대 불꽃놀이 축제. 광안대교가 배경', icon: '🎆' },
      { name: '부산 자갈치 축제', addr: '부산 중구 자갈치시장', startDate: '2026-10-08', endDate: '2026-10-12', note: '해양 문화 축제. 수산물 시식·판매', icon: '🐟' },
    ],
  },
  경북: {
    dayBefore: [
      { name: '황리단길', type: 'activity', icon: '☕', addr: '경북 경주시 포석로 1080 일대', note: '경주 핫플. 한옥 카페와 공방이 가득한 골목.', duration: 90, dist: 3500 },
      { name: '동궁과 월지(안압지)', type: 'attraction', icon: '🌙', addr: '경북 경주시 원화로 102', tel: '054-750-8655', note: '야경이 아름다운 신라 시대 연못. 레이스 전날 산책 추천.', duration: 60, dist: 3600 },
      { name: '최부자 한정식', type: 'food', icon: '🍱', addr: '경북 경주시 교촌길 39', note: '12대 전통 최부자댁 한정식. 경주 방문 시 필수 코스.', duration: 90, dist: 3900 },
      { name: '황남빵 본점', type: 'food', icon: '🍞', addr: '경북 경주시 태종로 783', tel: '054-749-7000', note: '팥이 가득한 경주 명물. 70년 전통.', duration: 30, dist: 4100 },
    ],
    dayOf: [
      { name: '벚꽃 마라톤 코스 포토존', type: 'activity', icon: '🌸', addr: '경북 경주시 보문로 일대', note: '봄엔 벚꽃 만개. 완주 후 인증샷 명소.', duration: 30, dist: 500 },
      { name: '경주 쌈밥', type: 'food', icon: '🥗', addr: '경북 경주시 내남면 일대', note: '경주 향토 음식. 다양한 나물과 함께.', duration: 60, dist: 4500 },
    ],
    dayAfter: [
      { name: '불국사', type: 'attraction', icon: '🛕', addr: '경북 경주시 불국로 385', tel: '054-746-9913', note: '유네스코 세계문화유산. 통일신라 최고 사찰.', duration: 150, dist: 8200 },
      { name: '석굴암', type: 'attraction', icon: '🗿', addr: '경북 경주시 불국로 873-243', note: '세계가 인정한 신라 조각 예술의 정점.', duration: 60, dist: 9500 },
      { name: '첨성대', type: 'attraction', icon: '🌙', addr: '경북 경주시 첨성로 169-1', note: '동양 최고 천문대. 신라 역사의 상징.', duration: 45, dist: 4100 },
      { name: '국립경주박물관', type: 'attraction', icon: '🏛️', addr: '경북 경주시 일정로 186', tel: '054-740-7500', note: '신라 천년의 역사를 한눈에. 무료 입장.', duration: 90, dist: 5000 },
    ],
    festivals: [
      { name: '경주 벚꽃 마라톤 축제', addr: '경북 경주시 보문관광단지', startDate: '2026-04-03', endDate: '2026-04-07', note: '벚꽃과 함께하는 봄 축제', icon: '🌸' },
      { name: '신라 문화제', addr: '경북 경주시 일원', startDate: '2026-10-01', endDate: '2026-10-10', note: '신라의 역사와 문화를 체험하는 전통 축제', icon: '🏯' },
    ],
  },
  강원: {
    dayBefore: [
      { name: '소양강 스카이워크', type: 'activity', icon: '🌉', addr: '강원 춘천시 영서로 2663', tel: '033-250-3592', note: '소양강 위를 걷는 투명 유리 다리. 스릴 만점.', duration: 60, dist: 5200 },
      { name: '춘천 닭갈비 골목', type: 'food', icon: '🍗', addr: '강원 춘천시 명동길 일대', note: '춘천 명물 닭갈비. 철판 닭갈비와 막국수 세트 추천.', duration: 90, dist: 4500 },
      { name: '의암호 수변공원', type: 'attraction', icon: '🌊', addr: '강원 춘천시 의암호', note: '호수를 따라 걷는 힐링 산책로. 레이스 전날 다리 풀기.', duration: 60, dist: 3500 },
      { name: '춘천 막국수', type: 'food', icon: '🍜', addr: '강원 춘천시 신북읍 일대', note: '춘천 본고장 막국수. 메밀향이 살아있는 정통 맛.', duration: 60, dist: 8000 },
    ],
    dayOf: [
      { name: '완주 후 막국수', type: 'food', icon: '🍜', addr: '강원 춘천시 동면 일대', note: '완주 후 시원한 막국수로 회복.', duration: 60, dist: 6000 },
      { name: '남이섬 페리', type: 'activity', icon: '⛴️', addr: '강원 춘천시 남산면 남이섬길 1', note: '나미나라공화국. 가을 단풍이 절경.', duration: 180, dist: 12000 },
    ],
    dayAfter: [
      { name: '남이섬', type: 'attraction', icon: '🌿', addr: '강원 춘천시 남산면 남이섬길 1', tel: '031-580-8114', note: '드라마 촬영지. 은행나무 길이 황금빛으로.', duration: 180, dist: 12000 },
      { name: '강촌 레일바이크', type: 'activity', icon: '🚲', addr: '강원 춘천시 신동면 강촌리', note: '북한강을 따라 달리는 레일바이크.', duration: 120, dist: 15000 },
      { name: '강원도 산채 비빔밥', type: 'food', icon: '🥗', addr: '강원 춘천시 일대', note: '강원도 산나물로 만든 건강한 한 그릇.', duration: 60, dist: 4000 },
    ],
    festivals: [
      { name: '춘천 마임 축제', addr: '강원 춘천시 일원', startDate: '2026-10-23', endDate: '2026-10-27', note: '국내 유일 마임 전문 축제', icon: '🎭' },
      { name: '화천 산천어 축제', addr: '강원 화천군 화천읍', startDate: '2027-01-10', endDate: '2027-02-05', note: '겨울 대표 축제. 산천어 낚시·빙판 체험', icon: '🐟' },
    ],
  },
  제주: {
    dayBefore: [
      { name: '성산일출봉', type: 'attraction', icon: '🌋', addr: '제주 서귀포시 성산읍 일출로 284-12', tel: '064-783-0959', note: '유네스코 세계자연유산. 새벽 일출 트레킹 추천.', duration: 120, dist: 42000 },
      { name: '흑돼지 거리', type: 'food', icon: '🥩', addr: '제주 제주시 연동 일대', note: '제주 명물 흑돼지 삼겹살. 제주 방문 필수 코스.', duration: 90, dist: 4200 },
      { name: '제주 동문시장', type: 'activity', icon: '🛒', addr: '제주 제주시 관덕로14길 20', tel: '064-752-3001', note: '제주 토속 먹거리·기념품. 오메기떡과 군고구마 추천.', duration: 60, dist: 3200 },
      { name: '협재해수욕장', type: 'attraction', icon: '🏖️', addr: '제주 제주시 한림읍 협재리', note: '에메랄드빛 바다. 비양도가 보이는 아름다운 해변.', duration: 90, dist: 22000 },
    ],
    dayOf: [
      { name: '올레시장 고기국수', type: 'food', icon: '🍜', addr: '제주 제주시 서광로2길 3', note: '제주 돼지뼈 육수 국수. 완주 후 든든하게.', duration: 60, dist: 3800 },
      { name: '한라산 어리목 탐방로', type: 'activity', icon: '🏔️', addr: '제주 제주시 1100로 2070-61', note: '가벼운 트레킹 코스. 한라산을 제대로 느끼기.', duration: 180, dist: 15000 },
    ],
    dayAfter: [
      { name: '천지연 폭포', type: 'attraction', icon: '💧', addr: '제주 서귀포시 천지동 667-7', note: '서귀포 대표 관광지. 천연기념물 담팔수 군락.', duration: 60, dist: 38000 },
      { name: '제주민속촌', type: 'attraction', icon: '🏘️', addr: '제주 서귀포시 표선면 민속해안로 631-34', note: '제주 전통 생활 문화 체험.', duration: 120, dist: 45000 },
      { name: '제주 해녀 체험', type: 'activity', icon: '🤿', addr: '제주 제주시 구좌읍 하도리', note: '제주 유네스코 해녀 문화 체험.', duration: 120, dist: 30000 },
      { name: '갈치국 제주 본점', type: 'food', icon: '🐠', addr: '제주 서귀포시 일대', note: '제주 갈치는 여기서. 은빛 갈치국 정식.', duration: 90, dist: 40000 },
    ],
    festivals: [
      { name: '제주 들불 축제', addr: '제주 제주시 새별오름', startDate: '2027-03-01', endDate: '2027-03-03', note: '오름에 불을 놓는 장관의 제주 전통 축제', icon: '🔥' },
      { name: '탐라 문화제', addr: '제주 제주시 일원', startDate: '2026-10-07', endDate: '2026-10-11', note: '제주 전통 문화 종합 축제', icon: '🎊' },
    ],
  },
  광주: {
    dayBefore: [
      { name: '양림동 역사문화마을', type: 'attraction', icon: '🏘️', addr: '광주 남구 양림동', note: '근대 역사가 살아있는 골목.', duration: 60, dist: 3000 },
      { name: '국립아시아문화전당', type: 'attraction', icon: '🏛️', addr: '광주 동구 문화전당로 38', note: '광주 문화 중심. 다양한 전시와 공연.', duration: 90, dist: 2800 },
      { name: '광주 오리탕 골목', type: 'food', icon: '🦆', addr: '광주 북구 신안동 일대', note: '광주 향토 음식 오리탕 골목.', duration: 60, dist: 3500 },
      { name: '1913 송정역 시장', type: 'activity', icon: '🛒', addr: '광주 광산구 송정로 8번길 13', note: '100년 전통 시장. 육전과 국밥 추천.', duration: 60, dist: 5000 },
    ],
    dayOf: [
      { name: '무등산 탐방', type: 'activity', icon: '🏔️', addr: '광주 북구 금곡동 산 1-1', note: '광주의 상징. 국립공원 트레킹.', duration: 180, dist: 5000 },
      { name: '광주 육전', type: 'food', icon: '🥩', addr: '광주 일대', note: '광주 대표 음식 육전. 완주 후 한 접시.', duration: 60, dist: 2500 },
    ],
    dayAfter: [
      { name: '국립광주박물관', type: 'attraction', icon: '🏛️', addr: '광주 북구 하서로 110', tel: '062-570-7000', note: '호남 역사 문화의 보고. 무료 입장.', duration: 90, dist: 4000 },
      { name: '5·18 민주화운동 기록관', type: 'attraction', icon: '🕊️', addr: '광주 동구 금남로 221', note: '역사를 기억하는 중요한 공간.', duration: 60, dist: 2800 },
      { name: '광주 한정식', type: 'food', icon: '🍱', addr: '광주 동구 일대', note: '한국 음식의 꽃. 광주에서 제대로 맛보기.', duration: 90, dist: 3000 },
    ],
    festivals: [
      { name: '광주 충장 축제', addr: '광주 동구 충장로·금남로', startDate: '2026-10-08', endDate: '2026-10-12', note: '도심을 무대로 한 시민 문화 축제', icon: '🎉' },
      { name: '광주 비엔날레', addr: '광주 북구 비엔날레로 111', startDate: '2026-09-05', endDate: '2026-11-29', note: '아시아 최대 현대미술 행사', icon: '🎨' },
    ],
  },
  전북: {
    dayBefore: [
      { name: '전주 한옥마을', type: 'attraction', icon: '🏘️', addr: '전북 전주시 완산구 기린대로 99 일대', note: '700여 채 전통 한옥. 한복 대여 체험 필수.', duration: 120, dist: 2000 },
      { name: '전주 비빔밥', type: 'food', icon: '🥗', addr: '전북 전주시 완산구 전동 일대', note: '전주에서 먹는 비빔밥은 다르다. 원조 전주 비빔밥.', duration: 60, dist: 2000 },
      { name: '경기전', type: 'attraction', icon: '🏯', addr: '전북 전주시 완산구 태조로 44', note: '태조 이성계의 어진을 모신 역사 공간.', duration: 60, dist: 1800 },
      { name: '전주 막걸리 골목', type: 'food', icon: '🍶', addr: '전북 전주시 완산구 삼천동 일대', note: '전주 3대 막걸리 골목. 안주가 무한으로 나오는 곳.', duration: 90, dist: 3000 },
    ],
    dayOf: [
      { name: '전주 콩나물국밥', type: 'food', icon: '🍲', addr: '전북 전주시 완산구 풍남동 일대', note: '완주 후 든든한 전주식 콩나물국밥.', duration: 60, dist: 1500 },
      { name: '한옥마을 공예 체험', type: 'activity', icon: '🎨', addr: '전북 전주시 완산구 한옥마을 내', note: '한지 공예·도자기 체험.', duration: 90, dist: 2000 },
    ],
    dayAfter: [
      { name: '덕진공원', type: 'attraction', icon: '🌸', addr: '전북 전주시 덕진구 권삼득로 390', note: '연꽃이 아름다운 전주 대표 공원.', duration: 60, dist: 3500 },
      { name: '전주동물원', type: 'activity', icon: '🦁', addr: '전북 전주시 덕진구 소리로 68', note: '가족 여행 필수 코스.', duration: 120, dist: 3800 },
      { name: '남원 춘향제', type: 'activity', icon: '🎭', addr: '전북 남원시 일대', note: '판소리의 고장 남원. 춘향 테마파크.', duration: 180, dist: 50000 },
    ],
    festivals: [
      { name: '전주 한지 문화제', addr: '전북 전주시 한옥마을', startDate: '2026-11-05', endDate: '2026-11-09', note: '전통 한지 공예 체험·전시', icon: '📜' },
      { name: '완주 와일드 푸드 축제', addr: '전북 완주군 고산 자연휴양림', startDate: '2026-10-10', endDate: '2026-10-12', note: '자연 식재료 요리·체험 축제', icon: '🍄' },
    ],
  },
  경남: {
    dayBefore: [
      { name: '통영 동피랑 벽화마을', type: 'attraction', icon: '🎨', addr: '경남 통영시 동피랑1길 일대', note: '부산 감천마을과 함께 대표 벽화마을.', duration: 60, dist: 20000 },
      { name: '하동 쌍계사', type: 'attraction', icon: '🛕', addr: '경남 하동군 화개면 쌍계사길 59', note: '섬진강변 천년 고찰. 벚꽃 명소.', duration: 90, dist: 5000 },
      { name: '하동 재첩국', type: 'food', icon: '🍲', addr: '경남 하동군 하동읍 섬진강대로 일대', note: '섬진강 명물 재첩국. 해장에 최고.', duration: 60, dist: 2000 },
      { name: '남해 다랑이 마을', type: 'attraction', icon: '🌾', addr: '경남 남해군 남면 홍현리', note: '가파른 산비탈 계단식 논. 절경.', duration: 60, dist: 15000 },
    ],
    dayOf: [
      { name: '완주 후 밀면', type: 'food', icon: '🍜', addr: '경남 창원시 일대', note: '경남 명물 밀면. 완주 후 시원하게.', duration: 60, dist: 2000 },
      { name: '마산 어시장', type: 'activity', icon: '🐟', addr: '경남 창원시 마산합포구 어시장3길 일대', note: '경남 최대 어시장.', duration: 60, dist: 5000 },
    ],
    dayAfter: [
      { name: '통영 케이블카', type: 'activity', icon: '🚡', addr: '경남 통영시 발개로 205', note: '한려수도 전망. 다도해 절경을 한눈에.', duration: 90, dist: 20000 },
      { name: '거제 해금강', type: 'attraction', icon: '🌊', addr: '경남 거제시 남부면 갈곶리', note: '한국의 나폴리. 기암절벽 절경.', duration: 120, dist: 40000 },
      { name: '진주 비빔밥', type: 'food', icon: '🥗', addr: '경남 진주시 일대', note: '진주 향토 비빔밥. 육회 비빔밥이 특별.', duration: 60, dist: 30000 },
    ],
    festivals: [
      { name: '하동 야생차 문화제', addr: '경남 하동군 화개면 일대', startDate: '2026-10-01', endDate: '2026-10-05', note: '천년 차의 고장 하동 차 문화 축제', icon: '🍵' },
      { name: '진주 남강 유등 축제', addr: '경남 진주시 남강', startDate: '2026-10-01', endDate: '2026-10-10', note: '남강에 수놓는 아름다운 유등 축제', icon: '🏮' },
    ],
  },
  대전: {
    dayBefore: [
      { name: '엑스포 과학공원', type: 'activity', icon: '🔬', addr: '대전 유성구 대덕대로 480', note: '93 엑스포 개최지. 과학 체험관과 전망대.', duration: 120, dist: 2000 },
      { name: '대전 두부두루치기', type: 'food', icon: '🍲', addr: '대전 유성구 봉명동 일대', note: '대전 명물 두부두루치기. 매콤하게 한 접시.', duration: 60, dist: 3000 },
      { name: '계족산 황톳길', type: 'activity', icon: '🌲', addr: '대전 대덕구 장동 산 28', note: '맨발 걷기 명소. 14km 황토 길.', duration: 120, dist: 8000 },
    ],
    dayOf: [
      { name: '성심당', type: 'food', icon: '🥐', addr: '대전 중구 은행로 65', note: '대전 빵집의 성지. 튀김소보로·부추빵 필수 구입.', duration: 30, dist: 4000 },
      { name: '한밭 수목원', type: 'attraction', icon: '🌿', addr: '대전 서구 둔산대로 169', note: '도심 속 거대 수목원. 가을 단풍.', duration: 90, dist: 3500 },
    ],
    dayAfter: [
      { name: '유성 온천', type: 'activity', icon: '♨️', addr: '대전 유성구 봉명동 일대', note: '완주·경기 후 온천 족욕으로 피로 회복.', duration: 90, dist: 4000 },
      { name: '국립중앙과학관', type: 'attraction', icon: '🔬', addr: '대전 유성구 대덕대로 481', tel: '042-601-7894', note: '한국 과학 문화 중심. 무료 입장.', duration: 90, dist: 2500 },
      { name: '보문산', type: 'activity', icon: '🏔️', addr: '대전 중구 보문산공원로 일대', note: '대전 시민의 산. 가볍게 걷기 좋은 코스.', duration: 90, dist: 5000 },
    ],
    festivals: [
      { name: '대전 사이언스 페스티벌', addr: '대전 유성구 엑스포 과학공원', startDate: '2026-10-21', endDate: '2026-10-25', note: '과학 체험·전시 복합 축제', icon: '🔬' },
    ],
  },
  인천: {
    dayBefore: [
      { name: '송도 센트럴파크', type: 'attraction', icon: '🌳', addr: '인천 연수구 컨벤시아대로 160', note: '바닷물이 흐르는 도심 공원. 자전거 대여.', duration: 90, dist: 1000 },
      { name: '인천 차이나타운', type: 'attraction', icon: '🏮', addr: '인천 중구 차이나타운로 일대', note: '짜장면 발원지. 공화춘에서 역사를 느껴보세요.', duration: 90, dist: 10000 },
      { name: '인천 자유공원', type: 'attraction', icon: '⚓', addr: '인천 중구 자유공원로 19', note: '맥아더 장군 동상. 인천상륙작전 역사.', duration: 60, dist: 10500 },
      { name: '송도 연안부두 횟집', type: 'food', icon: '🦞', addr: '인천 미추홀구 연안동', note: '싱싱한 바다 횟감. 인천에서 꼭.', duration: 90, dist: 8000 },
    ],
    dayOf: [
      { name: '강화도 고려 역사관', type: 'attraction', icon: '🏛️', addr: '인천 강화군 강화읍 일대', note: '고려 도읍지. 마니산 참성단.', duration: 180, dist: 40000 },
      { name: '짜장면 원조', type: 'food', icon: '🍜', addr: '인천 중구 차이나타운로', note: '대한민국 짜장면 1번지.', duration: 60, dist: 10000 },
    ],
    dayAfter: [
      { name: '월미도 문화의 거리', type: 'activity', icon: '🎡', addr: '인천 중구 월미로 33', note: '놀이공원·문화 거리. 바다 경관.', duration: 120, dist: 9000 },
      { name: '영종도 을왕리 해수욕장', type: 'attraction', icon: '🏖️', addr: '인천 중구 을왕리 일대', note: '인천공항 옆 숨은 해수욕장.', duration: 120, dist: 20000 },
    ],
    festivals: [
      { name: '인천 세계문화예술축제', addr: '인천 중구 차이나타운·개항장', startDate: '2026-10-01', endDate: '2026-10-10', note: '인천 개항의 역사를 주제로 한 문화 축제', icon: '⚓' },
    ],
  },
  충북: {
    dayBefore: [
      { name: '수안보 온천', type: 'activity', icon: '♨️', addr: '충북 충주시 수안보면 일대', note: '천연 온천. 대회 전날 피로 회복에 최고.', duration: 90, dist: 15000 },
      { name: '충주 수안보 민물고기 요리', type: 'food', icon: '🐟', addr: '충북 충주시 수안보면', note: '충주호 민물고기 매운탕. 향토 별미.', duration: 60, dist: 15000 },
      { name: '탄금대', type: 'attraction', icon: '🌿', addr: '충북 충주시 칠금동', note: '우륵이 가야금을 타던 역사적 명소.', duration: 60, dist: 3000 },
    ],
    dayOf: [
      { name: '충주 무·사과', type: 'food', icon: '🍎', addr: '충북 충주시 일대', note: '충주 명품 사과. 대회 후 달콤한 보상.', duration: 30, dist: 2000 },
    ],
    dayAfter: [
      { name: '충주호 유람선', type: 'activity', icon: '⛴️', addr: '충북 충주시 동량면 충주호', note: '충주호 아름다운 절경을 배 위에서.', duration: 120, dist: 12000 },
      { name: '청남대', type: 'attraction', icon: '🏛️', addr: '충북 청주시 상당구 문의면', note: '대통령 별장. 아름다운 호반 공원.', duration: 90, dist: 30000 },
    ],
    festivals: [
      { name: '충주 세계 무술 축제', addr: '충북 충주시 세계무술공원', startDate: '2026-10-06', endDate: '2026-10-10', note: '세계 60개국 무술 시연', icon: '🥋' },
      { name: '충주 사과 축제', addr: '충북 충주시 탄금호 일대', startDate: '2026-10-15', endDate: '2026-10-18', note: '충주 명품 사과 수확 축제', icon: '🍎' },
    ],
  },
};

// 기본 코스 (등록 없는 지역)
const DEFAULT_COURSE: EventCourse = {
  dayBefore: [
    { name: '지역 대표 관광지', type: 'attraction', icon: '🏛️', addr: '경기장 인근', note: 'TourAPI 기반 주변 관광지 정보입니다.', duration: 90, dist: 3000 },
    { name: '지역 맛집 탐방', type: 'food', icon: '🍽️', addr: '경기장 인근', note: '현지인 추천 맛집 골목을 찾아보세요.', duration: 60, dist: 2000 },
    { name: '지역 전통 시장', type: 'activity', icon: '🛒', addr: '경기장 인근', note: '지역 특산물과 먹거리를 만날 수 있는 시장.', duration: 60, dist: 2500 },
  ],
  dayOf: [
    { name: '대회 참가', type: 'activity', icon: '🏅', addr: '경기장', note: '대회 당일. 최선을 다해 완주하세요!', duration: 240, dist: 0 },
    { name: '완주 후 보양식', type: 'food', icon: '🍲', addr: '경기장 인근', note: '완주 후 영양 보충이 중요합니다.', duration: 60, dist: 1000 },
  ],
  dayAfter: [
    { name: '지역 역사 문화관', type: 'attraction', icon: '🏛️', addr: '경기장 인근', note: '지역의 역사와 문화를 배워보세요.', duration: 90, dist: 4000 },
    { name: '지역 특산 요리', type: 'food', icon: '🍽️', addr: '경기장 인근', note: '지역 특산 음식으로 마무리.', duration: 60, dist: 3000 },
    { name: '근교 자연 탐방', type: 'activity', icon: '🌿', addr: '경기장 인근', note: '지역 근교의 자연을 즐겨보세요.', duration: 120, dist: 8000 },
  ],
  festivals: [],
};

export function getCourseForEvent(region: string): EventCourse {
  return REGION_COURSES[region] || DEFAULT_COURSE;
}
