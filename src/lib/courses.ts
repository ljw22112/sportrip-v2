// ── 종목별 SVG 아이콘 경로
export const SPORT_SVG: Record<string,string> = {
  마라톤:'/sports/spotrip-sport-marathon.svg',
  러닝:  '/sports/spotrip-sport-marathon.svg',
  자전거:'/sports/spotrip-sport-cycling.svg',
  사이클:'/sports/spotrip-sport-cycling.svg',
  축구:  '/sports/spotrip-sport-soccer.svg',
  배드민턴:'/sports/spotrip-sport-badminton.svg',
  수영:  '/sports/spotrip-sport-swimming.svg',
  테니스:'/sports/spotrip-sport-tennis.svg',
  야구:  '/sports/spotrip-sport-baseball.svg',
  농구:  '/sports/spotrip-sport-basketball.svg',
  배구:  '/sports/spotrip-sport-volleyball.svg',
  태권도:'/sports/spotrip-sport-taekwondo.svg',
  유도:  '/sports/spotrip-sport-judo.svg',
  트레일:'/sports/spotrip-sport-hiking.svg',
  등산:  '/sports/spotrip-sport-hiking.svg',
  클라이밍:'/sports/spotrip-sport-climbing.svg',
  골프:  '/sports/spotrip-sport-golf.svg',
  종합:  '/sports/spotrip-sport-multi.svg',
  기타:  '/sports/spotrip-sport-etc.svg',
};

export interface TourSpot {
  name: string;
  addr?: string;
  desc?: string;
  tel?: string;
  url?: string;
}
export interface RegionTourData {
  festival:   TourSpot[];
  attraction: TourSpot[];
  culture:    TourSpot[];
  food:       TourSpot[];
  hotel:      TourSpot[];
}

export const REGION_TOUR: Record<string, RegionTourData> = {
  서울: {
    festival:[
      {name:'서울 빛초롱 축제', addr:'서울 중구 청계천로 일대', desc:'청계천을 수놓는 LED 등불 축제. 매년 가을~겨울 개최.'},
      {name:'서울 억새 축제', addr:'서울 마포구 하늘공원', desc:'하늘공원 억새밭 황금빛 물결. 10월 절정.'},
    ],
    attraction:[
      {name:'경복궁', addr:'서울 종로구 사직로 161', desc:'조선의 법궁. 야간개장 시즌이면 특히 아름답습니다.', tel:'02-3700-3900'},
      {name:'북촌한옥마을', addr:'서울 종로구 계동길 37', desc:'700여 채 전통 한옥이 이어진 골목. 인왕산 조망.'},
      {name:'남산서울타워', addr:'서울 용산구 남산공원길 105', desc:'서울 전경을 360도 조망. 케이블카 이용 가능.', tel:'02-3455-9277'},
    ],
    culture:[
      {name:'국립중앙박물관', addr:'서울 용산구 서빙고로 137', desc:'무료 입장. 국내 최대 규모 박물관.', tel:'02-2077-9000'},
      {name:'한강공원 자전거길', addr:'서울 영등포구 여의도', desc:'여의도에서 잠실까지 이어지는 평탄한 라이딩 코스.'},
      {name:'인사동 공예 거리', addr:'서울 종로구 인사동길', desc:'공예품·전통 기념품 쇼핑 거리.'},
    ],
    food:[
      {name:'광장시장 먹거리 골목', addr:'서울 종로구 창경궁로 88', desc:'빈대떡·육회·마약김밥으로 유명한 100년 전통 시장.'},
      {name:'명동 먹거리 골목', addr:'서울 중구 명동길 일대', desc:'다양한 길거리 음식과 음식점이 밀집한 쇼핑·미식 거리.'},
      {name:'을지로 뉴트로 맛집', addr:'서울 중구 을지로 일대', desc:'레트로 감성 골목에 숨어있는 현지인 맛집.'},
    ],
    hotel:[
      {name:'포시즌스 호텔 서울', addr:'서울 종로구 새문안로 97', desc:'광화문 도보 5분. 경기장 접근성 우수.', tel:'02-6388-5000'},
      {name:'롯데호텔 서울', addr:'서울 중구 을지로 30', desc:'명동 인근 대형 비즈니스 호텔.', tel:'02-771-1000'},
      {name:'여의도 비즈니스호텔 거리', addr:'서울 영등포구 여의도동', desc:'행사장 접근이 편한 중급 호텔이 밀집해 있습니다.'},
    ],
  },
  부산: {
    festival:[
      {name:'부산 불꽃 축제', addr:'부산 수영구 광안리해수욕장', desc:'국내 최대 불꽃놀이. 광안대교가 배경.'},
      {name:'부산 자갈치 축제', addr:'부산 중구 자갈치시장', desc:'해양 문화 축제. 수산물 시식·판매 행사.'},
    ],
    attraction:[
      {name:'해운대 해수욕장', addr:'부산 해운대구 해운대해변로 264', desc:'국내 최고 해수욕장. 가을엔 한산하고 경관이 빼어납니다.'},
      {name:'감천문화마을', addr:'부산 사하구 감내2로 203', desc:'부산의 산토리니. 알록달록 벽화 골목.', tel:'051-204-1444'},
      {name:'태종대 유원지', addr:'부산 영도구 전망로 24', desc:'부산 최남단 절경. 영도다리와 함께 대표 명소.'},
    ],
    culture:[
      {name:'블루라인파크 해변열차', addr:'부산 기장군 일광읍', desc:'해안 절경을 따라 달리는 관광 열차.'},
      {name:'BIFF 광장', addr:'부산 중구 남포동', desc:'부산국제영화제 상징. 핸드프린팅 명판 명소.'},
    ],
    food:[
      {name:'자갈치시장 횟집', addr:'부산 중구 자갈치해안로 52', desc:'부산 최대 수산시장. 싱싱한 활어회를 즉석에서.'},
      {name:'초량 밀면 골목', addr:'부산 동구 초량상로', desc:'부산 고유 음식 밀면. 냉면과는 다른 쫄깃한 맛.'},
      {name:'돼지국밥 골목', addr:'부산 부산진구 서면 일대', desc:'완주·경기 후 뜨끈한 국밥으로 체력 보충.'},
    ],
    hotel:[
      {name:'웨스틴 조선 부산', addr:'부산 해운대구 동백로 67', desc:'해운대 바다뷰. 대회 기간 조기 마감 주의.', tel:'051-749-7000'},
      {name:'해운대 그랜드 호텔', addr:'부산 해운대구 해운대해변로 209', desc:'해수욕장 도보 1분의 오션뷰 호텔.'},
    ],
  },
  경북: {
    festival:[
      {name:'신라 문화제', addr:'경북 경주시 일원', desc:'신라의 역사와 문화를 체험하는 전통 축제.'},
      {name:'경주 세계문화엑스포', addr:'경북 경주시 보문단지', desc:'문화·예술 복합 국제 행사.'},
    ],
    attraction:[
      {name:'불국사', addr:'경북 경주시 불국로 385', desc:'유네스코 세계문화유산. 통일신라 최고 사찰.', tel:'054-746-9913'},
      {name:'석굴암', addr:'경북 경주시 불국로 873-243', desc:'세계가 인정한 신라 조각 예술의 정점.'},
      {name:'첨성대·반월성', addr:'경북 경주시 첨성로 169-1', desc:'신라 천문대. 잔디밭 야경 산책 명소.'},
      {name:'동궁과 월지(안압지)', addr:'경북 경주시 원화로 102', desc:'신라 궁전 터. 야경이 빼어난 연못.', tel:'054-750-8655'},
    ],
    culture:[
      {name:'국립경주박물관', addr:'경북 경주시 일정로 186', desc:'신라 금관 소장. 무료 입장.', tel:'054-740-7500'},
      {name:'보문호 둘레길', addr:'경북 경주시 보문단지', desc:'벚꽃으로 유명한 호수 산책 코스.'},
      {name:'황리단길', addr:'경북 경주시 포석로 1080', desc:'한옥 카페와 공방이 가득한 경주 핫플.'},
    ],
    food:[
      {name:'황남빵 본점', addr:'경북 경주시 태종로 783', desc:'팥이 꽉 찬 70년 전통 경주 명물.', tel:'054-749-7000'},
      {name:'교동 최부자 한정식', addr:'경북 경주시 교촌길 39', desc:'12대 전통 최부자댁 한정식.'},
    ],
    hotel:[
      {name:'힐튼 경주', addr:'경북 경주시 보문로 484-7', desc:'보문단지 내. 출발선 도보 5분.', tel:'054-745-7788'},
      {name:'경주 보문 콘도', addr:'경북 경주시 보문로 468', desc:'보문단지 내 가족·단체 이용 편리.'},
    ],
  },
  강원: {
    festival:[
      {name:'춘천 마임 축제', addr:'강원 춘천시 일원', desc:'국내 유일 마임 전문 축제.'},
      {name:'설악 단풍 축제', addr:'강원 속초시 설악동', desc:'설악산 단풍 절정 시즌 축제.'},
    ],
    attraction:[
      {name:'소양강 스카이워크', addr:'강원 춘천시 영서로 2663', desc:'투명 바닥 위에서 소양호를 내려다보는 명소.', tel:'033-250-3592'},
      {name:'남이섬', addr:'강원 춘천시 남산면 남이섬길 1', desc:'낭만의 섬. 은행나무·메타세쿼이아 길.', tel:'031-580-8114'},
      {name:'설악산 국립공원', addr:'강원 속초시 설악동', desc:'단풍 능선 트레킹의 최고 명소.'},
    ],
    culture:[
      {name:'강촌 레일바이크', addr:'강원 춘천시 신동면 강촌리', desc:'북한강을 따라 달리는 레일바이크.'},
      {name:'의암호 자전거길', addr:'강원 춘천시', desc:'호수를 끼고 달리는 평탄한 코스.'},
    ],
    food:[
      {name:'춘천 닭갈비 골목', addr:'강원 춘천시 명동길', desc:'춘천 명물 철판 닭갈비. 막국수 세트 추천.'},
      {name:'춘천 막국수', addr:'강원 춘천시 신북읍', desc:'본고장 막국수. 메밀향이 살아있는 정통 맛.'},
    ],
    hotel:[
      {name:'춘천 스카이베이 경포 호텔', addr:'강원 강릉시 해안로 406', desc:'강원 대표 오션뷰 리조트.'},
      {name:'속초 롯데리조트', addr:'강원 속초시 청초호반로 275', desc:'설악산과 호수 전망 리조트.'},
    ],
  },
  제주: {
    festival:[
      {name:'탐라 문화제', addr:'제주 제주시 일원', desc:'제주 전통 문화 종합 축제.'},
      {name:'서귀포 감귤 박람회', addr:'제주 서귀포시', desc:'감귤 수확 시즌 체험 박람회.'},
    ],
    attraction:[
      {name:'성산일출봉', addr:'제주 서귀포시 성산읍 일출로 284-12', desc:'유네스코 세계자연유산. 새벽 일출 트레킹.', tel:'064-783-0959'},
      {name:'협재해수욕장', addr:'제주 제주시 한림읍 협재리', desc:'에메랄드빛 바다. 비양도가 보이는 해변.'},
      {name:'한라산 국립공원', addr:'제주 제주시', desc:'백록담까지 오르는 제주 대표 트레킹.'},
    ],
    culture:[
      {name:'올레 7코스', addr:'제주 서귀포시 외돌개', desc:'외돌개 해안을 따라 걷는 대표 올레길.'},
      {name:'제주 해녀 체험', addr:'제주 제주시 구좌읍 하도리', desc:'유네스코 해녀 문화 체험.'},
      {name:'제주민속촌', addr:'제주 서귀포시 표선면', desc:'제주 전통 생활 문화 체험.'},
    ],
    food:[
      {name:'서귀포 올레시장', addr:'제주 서귀포시', desc:'흑돼지·갈치·감귤 먹거리가 가득한 시장.'},
      {name:'흑돼지 거리', addr:'제주 제주시 연동', desc:'제주 명물 흑돼지 삼겹살 전문 거리.'},
      {name:'제주 고기국수', addr:'제주 제주시 서광로', desc:'돼지뼈 육수 국수. 완주 후 든든하게.'},
    ],
    hotel:[
      {name:'제주 신라호텔', addr:'제주 서귀포시 중문관광로 72번길', desc:'중문단지 내 5성급 호텔.', tel:'064-735-5114'},
      {name:'제주 그랜드 하얏트', addr:'제주 제주시 노연로 11', desc:'제주 시내 최고급 호텔.', tel:'064-747-1234'},
    ],
  },
  광주: {
    festival:[
      {name:'광주 충장 축제', addr:'광주 동구 충장로·금남로', desc:'도심을 무대로 한 시민 문화 축제.'},
      {name:'광주 비엔날레', addr:'광주 북구 비엔날레로 111', desc:'아시아 최대 현대미술 행사.'},
    ],
    attraction:[
      {name:'무등산 국립공원', addr:'광주 북구 금곡동', desc:'주상절리 서석대까지 오르는 명품 산행지.'},
      {name:'양림동 역사문화마을', addr:'광주 남구 양림동', desc:'근대 역사가 살아있는 골목.'},
    ],
    culture:[
      {name:'국립아시아문화전당', addr:'광주 동구 문화전당로 38', desc:'전시·공연이 열리는 복합 문화 공간.'},
      {name:'5·18 민주화운동 기록관', addr:'광주 동구 금남로 221', desc:'역사를 기억하는 중요한 공간.'},
    ],
    food:[
      {name:'1913 송정역 시장', addr:'광주 광산구 송정로 8번길 13', desc:'100년 전통 시장. 육전·국밥 추천.'},
      {name:'광주 한정식', addr:'광주 동구 일대', desc:'한국 음식의 꽃. 광주에서 제대로.'},
    ],
    hotel:[
      {name:'홀리데이인 광주', addr:'광주 서구 내방로 111', desc:'광주 중심부 비즈니스 호텔.'},
    ],
  },
  전북: {
    festival:[
      {name:'전주 비빔밥 축제', addr:'전북 전주시 한옥마을', desc:'비빔밥 문화와 전통 먹거리 축제.'},
      {name:'전주 한지 문화제', addr:'전북 전주시', desc:'전통 한지 공예 체험·전시.'},
    ],
    attraction:[
      {name:'전주 한옥마을', addr:'전북 전주시 완산구 기린대로', desc:'700여 채 전통 한옥. 한복 체험 필수.'},
      {name:'경기전', addr:'전북 전주시 완산구 태조로 44', desc:'태조 이성계 어진을 모신 역사 공간.'},
    ],
    culture:[
      {name:'전주천 벚꽃길', addr:'전북 전주시', desc:'하천 따라 걷거나 달리기 좋은 코스.'},
      {name:'전주동물원', addr:'전북 전주시 덕진구 소리로 68', desc:'가족 여행 필수 코스.'},
    ],
    food:[
      {name:'남부시장 야시장', addr:'전북 전주시 완산구', desc:'금요 야시장. 전주식 먹거리 총집합.'},
      {name:'전주 콩나물국밥', addr:'전북 전주시 완산구 풍남동', desc:'완주 후 든든한 전주식 국밥.'},
    ],
    hotel:[
      {name:'전주 한옥스테이', addr:'전북 전주시 완산구 한옥마을', desc:'온돌방에서 묵는 전통 한옥 숙소.'},
    ],
  },
  경남: {
    festival:[
      {name:'진주 남강 유등 축제', addr:'경남 진주시 남강', desc:'남강에 수놓는 아름다운 유등 축제.'},
      {name:'통영 한산대첩 축제', addr:'경남 통영시 강구안', desc:'임진왜란 승전을 기념하는 수상 축제.'},
    ],
    attraction:[
      {name:'통영 케이블카', addr:'경남 통영시 발개로 205', desc:'미륵산 정상에서 한려수도를 내려다봅니다.'},
      {name:'거제 해금강', addr:'경남 거제시 남부면', desc:'한국의 나폴리. 기암절벽 절경.'},
      {name:'남해 독일마을', addr:'경남 남해군 삼동면 물건리', desc:'독일 귀국 교포들이 세운 이국적 마을.'},
    ],
    culture:[
      {name:'미륵도 해안 산책로', addr:'경남 통영시', desc:'바다를 끼고 걷는 완만한 코스.'},
      {name:'하동 쌍계사', addr:'경남 하동군 화개면', desc:'섬진강변 천년 고찰. 벚꽃 명소.'},
    ],
    food:[
      {name:'하동 재첩국', addr:'경남 하동군 하동읍 섬진강대로', desc:'섬진강 명물 재첩국. 해장에 최고.'},
      {name:'통영 중앙시장', addr:'경남 통영시', desc:'활어회·꿀빵으로 유명한 항구 시장.'},
    ],
    hotel:[
      {name:'통영 바다뷰 펜션', addr:'경남 통영시 도남관광지', desc:'한려수도 전망의 숙소.'},
    ],
  },
  대전: {
    festival:[{name:'대전 사이언스 페스티벌', addr:'대전 유성구 엑스포 과학공원', desc:'과학 체험·전시 복합 축제.'}],
    attraction:[
      {name:'유성 온천 족욕체험장', addr:'대전 유성구', desc:'무료 족욕으로 피로를 푸는 온천 거리.'},
      {name:'계족산 황톳길', addr:'대전 대덕구 장동', desc:'맨발 걷기 명소. 14km 황토길.'},
    ],
    culture:[
      {name:'국립중앙과학관', addr:'대전 유성구 대덕대로 481', desc:'한국 과학 문화의 중심. 무료 입장.', tel:'042-601-7894'},
      {name:'갑천 산책로', addr:'대전 서구', desc:'강변 걷기·자전거 코스.'},
    ],
    food:[
      {name:'성심당 본점', addr:'대전 중구 은행로 65', desc:'전국구 빵집. 튀김소보로·부추빵 필수.'},
      {name:'두부두루치기 골목', addr:'대전 유성구 봉명동', desc:'대전 향토 음식 매콤한 두부두루치기.'},
    ],
    hotel:[{name:'유성 온천 호텔', addr:'대전 유성구 봉명동', desc:'온천을 갖춘 유성의 대표 숙소.'}],
  },
  인천: {
    festival:[{name:'인천 세계문화예술축제', addr:'인천 중구 개항장', desc:'인천 개항의 역사를 주제로 한 문화 축제.'}],
    attraction:[
      {name:'송도 센트럴파크', addr:'인천 연수구 컨벤시아대로 160', desc:'바닷물이 흐르는 도심 공원.'},
      {name:'인천 차이나타운', addr:'인천 중구 차이나타운로', desc:'짜장면 발원지. 공화춘과 역사 거리.'},
    ],
    culture:[
      {name:'인천 개항박물관', addr:'인천 중구', desc:'개항기 역사를 담은 근대 건축 박물관.'},
      {name:'월미도 문화의 거리', addr:'인천 중구 월미로 33', desc:'놀이공원·문화 거리.'},
    ],
    food:[
      {name:'연안부두 횟집 거리', addr:'인천 미추홀구 연안동', desc:'싱싱한 바다 횟감. 인천에서 꼭.'},
      {name:'짜장면 원조 거리', addr:'인천 중구 차이나타운', desc:'대한민국 짜장면 1번지.'},
    ],
    hotel:[{name:'송도 호텔가', addr:'인천 연수구 송도', desc:'경기장과 가까운 신도시 호텔.'}],
  },
  충북: {
    festival:[
      {name:'충주 세계 무술 축제', addr:'충북 충주시 세계무술공원', desc:'세계 60개국 무술 시연.'},
      {name:'충주 사과 축제', addr:'충북 충주시 탄금호', desc:'충주 명품 사과 수확 축제.'},
    ],
    attraction:[
      {name:'청남대', addr:'충북 청주시 상당구 문의면', desc:'대통령 별장이었던 호반 명소.'},
      {name:'탄금대', addr:'충북 충주시 칠금동', desc:'우륵이 가야금을 타던 역사 명소.'},
    ],
    culture:[
      {name:'충주호 유람선', addr:'충북 충주시 동량면', desc:'충주호 절경을 배 위에서.'},
      {name:'무심천 산책로', addr:'충북 청주시', desc:'도심 걷기·달리기 코스.'},
    ],
    food:[
      {name:'충주 사과·무', addr:'충북 충주시', desc:'충주 명품 사과. 대회 후 달콤한 보상.'},
    ],
    hotel:[{name:'수안보 온천 리조트', addr:'충북 충주시 수안보면', desc:'천연 온천. 대회 후 피로 회복.'}],
  },
  충남: {
    festival:[{name:'보령 머드 축제', addr:'충남 보령시 대천해수욕장', desc:'세계적으로 유명한 머드 체험 축제.'}],
    attraction:[{name:'대천해수욕장', addr:'충남 보령시 신흑동', desc:'머드축제로 유명한 서해 대표 해변.'}],
    culture:[{name:'대천 짚트랙', addr:'충남 보령시', desc:'해변 위를 가로지르는 짚라인 체험.'}],
    food:[{name:'보령 수산시장', addr:'충남 보령시', desc:'제철 조개구이와 회를 맛보는 항구 시장.'}],
    hotel:[{name:'대천 오션뷰 리조트', addr:'충남 보령시', desc:'해수욕장 앞의 가족형 숙소.'}],
  },
  전남: {
    festival:[{name:'여수 밤바다 불꽃축제', addr:'전남 여수시 해양공원', desc:'여수 해양공원에서 펼쳐지는 불꽃 축제.'}],
    attraction:[
      {name:'여수 낭만포차', addr:'전남 여수시', desc:'야경과 함께 즐기는 해안 명소.'},
      {name:'오동도 산책로', addr:'전남 여수시', desc:'방파제를 건너 동백숲을 걷는 코스.'},
    ],
    culture:[{name:'예울마루', addr:'전남 여수시', desc:'바다를 향해 지은 여수의 공연·전시장.'}],
    food:[{name:'여수 서시장', addr:'전남 여수시', desc:'갓김치·서대회로 유명한 재래시장.'}],
    hotel:[{name:'여수 오션뷰 호텔', addr:'전남 여수시', desc:'이순신광장 인근의 전망 좋은 숙소.'}],
  },
  경기: {
    festival:[{name:'양평 물빛 축제', addr:'경기 양평군 두물머리', desc:'두물머리 일원의 가을 수상 축제.'}],
    attraction:[
      {name:'수원 화성 성곽길', addr:'경기 수원시 팔달구', desc:'유네스코 세계유산 성곽 산책.'},
      {name:'남한산성', addr:'경기 광주시 남한산성면', desc:'조선 시대 산성. 서울 근교 트레킹.'},
    ],
    culture:[
      {name:'국립현대미술관 과천관', addr:'경기 과천시', desc:'산자락에 자리한 대형 미술관.'},
      {name:'광교호수공원 둘레길', addr:'경기 수원시 영통구', desc:'호수 둘레 걷기·달리기 코스.'},
    ],
    food:[
      {name:'수원 행궁동 맛집골목', addr:'경기 수원시 팔달구', desc:'왕갈비와 통닭 거리가 이어지는 먹거리 골목.'},
    ],
    hotel:[{name:'수원 호텔가', addr:'경기 수원시', desc:'경기장 접근이 편한 비즈니스 숙소.'}],
  },
  대구: {
    festival:[{name:'수성못 겨울빛 페스티벌', addr:'대구 수성구 수성못', desc:'겨울 빛 축제. 수성못 야경 명소.'}],
    attraction:[
      {name:'수성못', addr:'대구 수성구', desc:'야경과 음악분수로 유명한 도심 호수.'},
      {name:'앞산 하늘다리', addr:'대구 남구', desc:'전망대까지 오르는 가벼운 산행.'},
    ],
    culture:[
      {name:'대구미술관', addr:'대구 수성구', desc:'수성 알파시티에 자리한 현대미술관.'},
    ],
    food:[{name:'들안길 먹거리타운', addr:'대구 수성구', desc:'대구 미식 거리. 다양한 음식점이 밀집.'}],
    hotel:[{name:'수성 호텔', addr:'대구 수성구', desc:'수성못 옆 전망 좋은 숙소.'}],
  },
  울산: {
    festival:[{name:'태화강 납량 축제', addr:'울산 중구 태화강국가정원', desc:'여름 납량 특집 문화 행사.'}],
    attraction:[
      {name:'태화강국가정원', addr:'울산 중구', desc:'십리대숲과 정원이 이어지는 강변 명소.'},
      {name:'대왕암공원', addr:'울산 동구', desc:'기암 해안을 따라 걷는 산책 코스.'},
    ],
    culture:[{name:'울산박물관', addr:'울산 남구', desc:'산업도시 울산의 역사 전시관.'}],
    food:[{name:'울산 큰애기야시장', addr:'울산 중구 중앙시장', desc:'저녁 먹거리 골목.'}],
    hotel:[{name:'태화강 조망 호텔', addr:'울산 중구', desc:'강변 전망의 도심 숙소.'}],
  },
  세종: {
    festival:[],
    attraction:[
      {name:'세종 호수공원', addr:'세종특별자치시', desc:'국내 최대 인공호수 공원.'},
      {name:'국립세종수목원', addr:'세종특별자치시', desc:'사계절 온실을 갖춘 도심형 수목원.'},
    ],
    culture:[{name:'금강 자전거길', addr:'세종특별자치시', desc:'금강을 따라 달리는 평탄한 라이딩 코스.'}],
    food:[{name:'도담동 맛집거리', addr:'세종특별자치시', desc:'정부청사 인근 식당가.'}],
    hotel:[{name:'정부청사 인근 호텔', addr:'세종특별자치시', desc:'행사장 이동이 편한 비즈니스 숙소.'}],
  },
};

// 기본값 (데이터 없는 지역)
const DEFAULT_TOUR: RegionTourData = {
  festival:[],
  attraction:[{name:'지역 대표 관광지', addr:'경기장 인근', desc:'한국관광공사 TourAPI 기반 주변 관광지 정보입니다.'}],
  culture:[{name:'지역 문화·레포츠 시설', addr:'경기장 인근', desc:'지역 문화시설 및 체험 활동 정보입니다.'}],
  food:[{name:'지역 맛집', addr:'경기장 인근', desc:'현지인 추천 맛집 정보입니다.'}],
  hotel:[{name:'경기장 인근 숙박', addr:'경기장 인근', desc:'경기장 접근이 편한 숙소입니다.'}],
};

export function getTourData(region: string): RegionTourData {
  return REGION_TOUR[region] || DEFAULT_TOUR;
}
