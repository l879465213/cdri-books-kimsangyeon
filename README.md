# cdri-books-김상연

도서 검색 및 찜하기 기능을 제공하는 React 기반 프론트엔드 애플리케이션입니다.

장성자: 김상연
소요시간: 2~3시간

## 📦 주요 패키지

### Dependencies

- **React** (^19.1.1) - UI 라이브러리
- **React Router DOM** (^7.9.5) - 라우팅
- **@tanstack/react-query** (^5.90.7) - 서버 상태 관리 및 데이터 페칭
- **Axios** (^1.13.2) - HTTP 클라이언트
- **Tailwind CSS** (^4.1.16) - 유틸리티 CSS 프레임워크
- **Jotai** (^2.15.1) - 상태 관리
- **React Toastify** (^11.0.5) - 토스트 알림
- **date-fns** (^4.1.0) - 날짜 유틸리티
- **tailwind-merge** (^3.4.0) - Tailwind 클래스 병합 유틸리티

### DevDependencies

- **TypeScript** (~5.9.3) - 타입 안정성
- **Vite** (^7.1.7) - 빌드 도구
- **ESLint** (^9.36.0) - 코드 린팅
- **React Compiler** - React 최적화 컴파일러

## 📁 프로젝트 구조

```
src/
├── features/              # 기능별 모듈
│   └── book/             # 도서 관련 기능
│       ├── api/          # API 호출 함수
│       ├── components/   # 도서 관련 컴포넌트
│       │   └── HeartIcon.tsx
│       ├── hooks/        # 커스텀 훅
│       │   └── useSavedBooks.ts
│       ├── pages/        # 페이지 컴포넌트
│       │   ├── Book.tsx
│       │   └── SavedBook.tsx
│       ├── routes/       # 라우트 설정
│       └── types/        # 타입 정의
├── shared/               # 공유 모듈
│   ├── api/             # 공통 API 설정
│   │   ├── axios.ts
│   │   └── routes.ts
│   ├── components/      # 공통 컴포넌트
│   │   ├── AdvancedSearchModal.tsx
│   │   ├── CustomButton.tsx
│   │   ├── ErrorPage.tsx
│   │   ├── ErrorWrapper.tsx
│   │   ├── GlobalToast.tsx
│   │   └── SearchInput.tsx
│   ├── hooks/           # 공통 훅
│   │   ├── useLocalStorage.ts
│   │   ├── useReplaceQuery.tsx
│   │   └── useToast.tsx
│   ├── layouts/         # 레이아웃 컴포넌트
│   ├── providers/       # Context Provider
│   │   └── queryProvider.tsx
│   ├── store/           # 상태 관리
│   │   └── toast/
│   ├── types/           # 공통 타입
│   └── utils/           # 유틸리티 함수
├── layouts/             # 레이아웃
├── config/              # 설정 파일
├── assets/              # 정적 리소스
├── App.tsx
├── routes.tsx
└── main.tsx
```

## 🚀 주요 기능

### 1. 도서 검색 (Book 페이지)

- **무한 스크롤**: React Query의 `useInfiniteQuery`를 사용한 페이지네이션
- **검색 기능**:
  - 기본 검색: 키워드 검색
  - 상세 검색: 제목, 출판사, 저자별 검색
  - 최근 검색어 저장 (최대 8개)
- **아코디언 상세보기**:
  - 리스트에서 상세보기 버튼 클릭 시 부드러운 애니메이션으로 펼침
  - 닫을 때는 즉시 닫힘
  - 펼쳐진 상태에서 큰 이미지와 상세 정보 표시
- **찜하기 기능**: 하트 버튼으로 도서 찜하기/해제
- **구매하기**: 외부 링크로 새 창에서 열기

### 2. 찜한 도서 (SavedBook 페이지)

- 찜한 도서 목록 표시
- Book 페이지와 동일한 레이아웃 및 기능
- 하트 버튼으로 찜 해제 가능

### 3. 찜하기 기능

- **localStorage 기반 저장**: 브라우저 새로고침 후에도 유지
- **하트 아이콘**:
  - 찜한 도서: 빨간색 채워진 하트
  - 미찜 도서: 회색 빈 하트
  - 이미지 우상단에 작고 투명한 배경으로 표시

## 🛠️ 기술 스택

- **프레임워크**: React 19
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**:
  - React Query (서버 상태)
  - Jotai (클라이언트 상태)
  - localStorage (찜한 도서)
- **빌드 도구**: Vite
- **라우팅**: React Router v7

## 🎯 라이브러리 선택 이유

### @tanstack/react-query

- **서버 상태 관리의 복잡성 해결**: 캐싱, 동기화, 백그라운드 업데이트를 자동으로 처리
- **무한 스크롤 구현 용이**: `useInfiniteQuery`로 페이지네이션을 간단하게 구현
- **자동 리페칭**: 윈도우 포커스, 네트워크 재연결 시 자동으로 데이터 갱신
- **에러 처리 및 로딩 상태**: 내장된 에러 핸들링과 로딩 상태 관리

### React Router DOM (useSearchParams)

- **URL 상태 동기화**: 검색 조건을 URL 쿼리 파라미터로 관리하여 브라우저 뒤로가기/앞으로가기 지원
- **공유 가능한 링크**: 검색 결과를 URL로 공유 가능
- **상태 관리 단순화**: 별도의 상태 관리 없이 URL을 단일 소스로 사용

### Tailwind CSS

- **빠른 개발 속도**: 유틸리티 클래스로 빠른 스타일링
- **일관된 디자인**: 디자인 시스템을 클래스로 정의하여 일관성 유지
- **번들 크기 최적화**: 사용하지 않는 CSS 자동 제거

### Jotai

- **경량 상태 관리**: 작은 번들 크기로 가벼운 상태 관리
- **원자적 상태**: 작은 단위의 상태로 세밀한 제어 가능
- **TypeScript 친화적**: 완벽한 타입 추론 지원

## ⭐ 강조하고 싶은 기능

### 1. useInfiniteQuery와 searchParams의 시너지

**URL 기반 상태 관리 + 무한 스크롤의 완벽한 조합**

```typescript
// searchParams를 queryKey에 포함하여 URL 변경 시 자동 리페칭
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ["book", searchParams?.toString()], // URL 변경 감지
  queryFn: ({ pageParam = 1 }) =>
    getBookListFn({
      keyword: searchParams.get("keyword")!,
      page: String(pageParam),
      size: "10",
      target: searchParams.get("target"),
    }),
  getNextPageParam: (lastPage, allPages) => {
    if (lastPage?.meta?.is_end) return undefined;
    return allPages.length + 1;
  },
});
```

**장점:**

- 🔄 **자동 동기화**: URL 변경 시 자동으로 새로운 검색 실행
- 🔗 **공유 가능**: 검색 결과 URL을 공유하면 동일한 결과 표시
- ⏪ **브라우저 히스토리**: 뒤로가기/앞으로가기로 이전 검색 결과 복원
- 💾 **상태 지속성**: 새로고침 후에도 검색 조건 유지

### 2. IntersectionObserver를 활용한 무한 스크롤

**사용자 경험 최적화: 자동 로딩**

```typescript
// 스크롤 감지로 자동 다음 페이지 로드
const handleObserver = useCallback(
  (entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },
  [hasNextPage, isFetchingNextPage, fetchNextPage]
);
```

**장점:**

- 🚀 **부드러운 UX**: 버튼 클릭 없이 자동으로 다음 데이터 로드
- ⚡ **성능 최적화**: 필요한 시점에만 데이터 페칭
- 📱 **모바일 친화적**: 스크롤 기반 인터랙션으로 모바일에서 자연스러움

### 3. localStorage 기반 찜하기 기능

**서버 없이도 영구 저장**

```typescript
// 커스텀 훅으로 간단한 찜하기 관리
const { savedBooks, isBookSaved, toggleSaveBook } = useSavedBooks();
```

**장점:**

- 💾 **영구 저장**: 브라우저를 닫아도 찜한 도서 유지
- ⚡ **즉시 반영**: 서버 요청 없이 즉시 UI 업데이트
- 🔄 **동기화**: 여러 탭 간 자동 동기화 (localStorage 이벤트 활용 가능)

## 💡 핵심 구현 패턴

### useInfiniteQuery + searchParams 활용

이 프로젝트의 핵심은 **URL 기반 상태 관리**와 **무한 스크롤**의 조합입니다.

#### 1. URL을 단일 소스로 사용

```typescript
// 검색 조건을 URL에 저장
const [searchParams, setSearchParams] = useSearchParams();

// URL 변경 시 자동으로 새로운 검색 실행
const { data } = useInfiniteQuery({
  queryKey: ["book", searchParams?.toString()], // URL이 queryKey
  queryFn: ({ pageParam }) =>
    getBookListFn({
      keyword: searchParams.get("keyword")!,
      page: String(pageParam),
      target: searchParams.get("target"),
    }),
});
```

#### 2. 검색 시 URL 업데이트

```typescript
const handleSearch = (value: string) => {
  const newParams = new URLSearchParams(searchParams);
  newParams.set("keyword", value);
  newParams.delete("page"); // 새 검색 시 페이지 초기화
  setSearchParams(newParams); // URL 변경 → 자동 리페칭
};
```

#### 3. 무한 스크롤과의 조합

```typescript
// 모든 페이지 데이터를 하나로 합치기
const allBooks = bookListData.pages.flatMap((page) => page.documents || []);

// 다음 페이지 자동 로드
useEffect(() => {
  const observer = new IntersectionObserver(handleObserver);
  observer.observe(observerTarget.current);
  return () => observer.disconnect();
}, [handleObserver]);
```

**이 패턴의 장점:**

- ✅ URL이 상태의 단일 소스 (Single Source of Truth)
- ✅ 브라우저 히스토리와 완벽한 통합
- ✅ 검색 결과 공유 가능
- ✅ 새로고침 후에도 상태 유지
- ✅ React Query의 캐싱과 자동 동기화 활용

## 📝 오늘 작업한 내용

### 구현된 기능

1. ✅ **무한 스크롤 구현**

   - `useInfiniteQuery`를 사용한 페이지네이션
   - IntersectionObserver를 활용한 자동 로딩
   - 10개씩 로드

2. ✅ **아코디언 상세보기**

   - CSS transition을 활용한 부드러운 애니메이션
   - 열 때: 300ms 애니메이션
   - 닫을 때: 즉시 닫힘
   - 펼쳐진 상태에서 큰 이미지와 상세 정보 표시

3. ✅ **찜하기 기능**

   - `useSavedBooks` 커스텀 훅 생성
   - localStorage를 통한 영구 저장
   - 하트 아이콘 컴포넌트 생성
   - 리스트 및 상세보기에서 하트 버튼 추가

4. ✅ **SavedBook 페이지**
   - Book 페이지와 동일한 구조
   - 찜한 도서 목록 표시
   - 찜 해제 기능

### UI/UX 개선

- 하트 버튼 크기 및 투명도 조정 (16px, 50% 투명 배경)
- 가격 표시 개선 (원가/할인가 구분)
- 반응형 레이아웃 개선

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### env 세팅 (.env.sample)

```bash
VITE_BOOK_URL=
VITE_KAKAO_REST_API_KEY=
```

### 개발 서버 실행

```bash
pnpm dev
```

### 빌드

```bash
pnpm build
```

### 린트

```bash
pnpm lint
```
