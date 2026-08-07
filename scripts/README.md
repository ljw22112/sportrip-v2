# 스포트립 대회 데이터 자동 수집

## 실행 방법

### 수동 실행
```bash
node scripts/fetch-events.js
```

### 환경 변수 설정
```bash
# .env.local (로컬 테스트용)
DATA_GO_KR_KEY=여기에_공공데이터포털_API키_입력
```

## GitHub Secrets 설정 방법

레포지토리 → Settings → Secrets and variables → Actions → New repository secret

| Secret 이름 | 내용 | 필수 |
|-------------|------|------|
| `DATA_GO_KR_KEY` | 공공데이터포털 API 키 | 권장 |
| `VERCEL_DEPLOY_HOOK` | Vercel Deploy Hook URL | 선택 |

## 공공데이터포털 API 키 발급

1. https://www.data.go.kr 접속
2. 회원가입 / 로그인
3. 검색: "체육대회" 또는 "스포츠 행사"
4. 원하는 API 선택 → 활용 신청
5. 마이페이지 → API 키 복사

## 자동 실행 스케줄

매주 금요일 오전 9시 (KST) 자동 실행
- GitHub Actions 탭에서 수동 실행도 가능
- dry_run=true 옵션으로 테스트 실행 가능

## 데이터 소스

| 소스 | URL | 데이터 |
|------|-----|--------|
| 공공데이터포털 | data.go.kr | 국민체육진흥공단 대회 정보 |
| 스포츠지원포털 | sports.or.kr | 생활체육 대회 목록 |
