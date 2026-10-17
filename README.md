# Go Link

주소창에 `go/google`을 입력하면 google.com으로 이동하는 Chrome 확장 프로그램.
`go`와 이름은 **대소문자를 구분하지 않습니다** (`GO/Google`, `Go/GOOGLE` 모두 동일).

Google, Bing, Naver, DuckDuckGo, Yahoo, Daum 검색창 입력과 `http://go/<이름>` 모두 지원합니다.

## 설치 (PC마다 1회)
1. 이 저장소를 받습니다: `git clone https://github.com/KimOohjin/chrome-go-link.git`
   (또는 **Code → Download ZIP** 후 압축 해제)
2. Chrome에서 `chrome://extensions` → 우측 상단 **개발자 모드** 켜기
3. **압축해제된 확장 프로그램을 로드합니다** → 받은 폴더 안의 `extension` 폴더 선택
4. (선택) 퍼즐 아이콘에서 Go Link를 툴바에 고정

> 회사/학교 관리 브라우저는 정책상 압축해제된 확장 설치가 막혀 있을 수 있습니다.

## 사용
- 주소창에 `go/naver` 입력 → naver.com 이동
- 기본 링크: `google`, `naver`, `github`, `youtube`

## 사이트 추가/삭제
확장 아이콘 클릭 → `go/` 뒤에 이름, 옆에 `https://...` 전체 주소 입력 → **추가**.
같은 이름으로 다시 추가하면 주소가 바뀝니다.

한꺼번에 추가하려면 **가져오기**에 JSON을 붙여 넣으세요.
```json
{ "mail": "https://mail.google.com", "cal": "https://calendar.google.com" }
```

## 다른 PC와 동기화
링크 목록은 `chrome.storage.sync`에 저장됩니다. 모든 PC에서 같은 Google 계정으로 Chrome에 로그인하고 동기화를 켜면 목록이 자동 공유됩니다.
동기화를 쓰지 않으면 **내보내기/가져오기**(JSON)로 옮기세요.

## 업데이트
저장소를 `git pull`(또는 새 ZIP로 교체)한 뒤 `chrome://extensions`에서 Go Link의 **새로고침(↻)**을 누르세요.

## 개발
`node extension/test.js` — 이름 매칭 셀프체크.
