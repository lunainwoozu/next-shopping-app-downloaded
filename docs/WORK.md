# WORK.md

10일 쇼핑몰 프로젝트 커리큘럼 진행 현황을 관리합니다.

---

## 마이그레이션 구현 진척도 (JSX 프로토타입 → Next.js App Router)

> CSS 전략: S01–S05 Tailwind / **S06 이후 styles.css 클래스 직접 사용**

| 세션 | 내용 | 상태 |
|------|------|------|
| S01–S04 | 프로젝트 셋업, 레이아웃, 홈, 상품 목록 | ✅ 완료 |
| S05 | 상품 상세, Zustand cartStore, ProductCard/Grid/AddToCartButton | ✅ 완료 |
| S06 | 장바구니 페이지, CartDrawer, CartSection, Header/MobileMenu 업데이트 | ✅ 완료 |
| S07 | Checkout 페이지, 주문 완료 페이지 | ✅ 완료 |
| S08 | 로그인, 회원가입 페이지 | ✅ 완료 |
| S09 | 마이페이지, OrderCard | ✅ 완료 |
| S10 | 관리자 상품 관리, ProductFormModal | ✅ 완료 |
| S11 | loading.tsx, error.tsx, not-found.tsx | ✅ 완료 |

### 잔여 / 확인 필요 항목

- [x] **홈 페이지** (`src/app/page.tsx`) — `section-head`, `eyebrow`, `section-head__right` 적용 완료
- [x] **상품 관련 전체** — `src/app/products/page.tsx`, `[id]/page.tsx`, `ProductCard`, `ProductGrid`, `AddToCartButton`, `ProductDetail` styles.css 마이그레이션 완료
- [x] **globals.css 정리** — 중복 `@layer base` 제거, 다크모드 dead code 제거, layout.tsx `antialiased` 제거
- [ ] **브라우저 통합 테스트** — DB 연결 후 전체 플로우(회원가입 → 로그인 → 상품 → 장바구니 → 주문 → 마이페이지 → 관리자) 검증

---

## 10일 커리큘럼 진척도

- [x] Day 1: 기획 리뷰 및 환경 스택 확정 (Next.js + Prisma)
- [x] Day 2: DB 스키마 생성 및 공통 코드/더미 데이터 삽입
- [x] Day 3: NextAuth.js 기반 로그인/회원가입 및 미들웨어 라우팅 보호
- [x] Day 4: 공통 UI 컴포넌트 및 상품 목록 페이지 구현
- [x] Day 5: 상품 상세 페이지 및 장바구니 (Zustand) 구현
- [x] Day 6: 주문 및 모의 결제 트랜잭션 (API Route, Prisma Transaction)
- [x] Day 7: 마이페이지 (사용자 주문 내역 조회)
- [x] Day 8: 관리자 백오피스 (상품 등록 및 주문 상태 변경)
- [x] Day 9: 대시보드 UI 연동 및 최적화
- [x] Day 10: 배포 및 회고

---

## ✅ 전체 수업 문서 작성 완료

10일 커리큘럼 모든 문서가 완성되었습니다.

---

## 수업 문서 작업 현황

- [x] `docs/SHOPPING_PLAN.md` — 10일 전체 커리큘럼 목차 완료
- [x] `docs/ARCHITECTURE.md` — 프로젝트 구조 & 파일 역할 가이드 완료
- [x] `docs/steps/step-01-setup.md` — Ch 1. 프로젝트 기획 & 환경 셋업 완료
- [x] `docs/steps/step-02a-erd.md` — Ch 2-1. 엔티티 추출 개념 → AI로 SQL 생성 → DrawDB 시각화 → DBeaver 연동
- [x] `docs/steps/step-02b-prisma-schema.md` — Ch 2-2. Prisma 스키마 작성 → migrate dev → Prisma Studio 확인
- [x] `docs/steps/step-02c-seed.md` — Ch 2-3. 강사 제공 seed.ts 실행 가이드
- [x] `docs/steps/step-03-nextauth.md` — Ch 3. NextAuth.js 회원가입·로그인·미들웨어 라우트 보호
- [x] `docs/steps/step-04-product-list.md` — Ch 4. Header 레이아웃·상품 목록·카테고리 필터·Skeleton Loading
- [x] `docs/steps/step-05-cart-zustand.md` — Ch 5. 상품 상세(동적 라우트)·Zustand 장바구니 스토어·persist·CartBadge
- [x] `docs/steps/step-06-order-checkout.md` — Ch 6. 주문 폼(RHF+Zod)·POST /api/orders·Prisma Transaction·주문 완료 페이지
- [x] `docs/steps/step-07-mypage.md` — Ch 7. QueryProvider 설정·GET /api/orders·useQuery·OrderCard(상태 배지)·캐시 확인
- [x] `docs/steps/step-08-admin.md` — Ch 8. admin layout 권한체크·상품 등록·GET/PATCH API·useMutation+invalidateQueries
- [x] `docs/steps/step-09-optimize.md` — Ch 9. 통계(Promise.all·aggregate)·generateStaticParams·revalidate·error.tsx·not-found.tsx
- [x] `docs/steps/step-10-deploy.md` — Ch 10. Neon DB·Vercel 배포·환경변수·prisma migrate deploy·KPT 회고·확장 아이디어

---

## 결정 사항

| 날짜 | 결정 내용 |
| --- | --- |
| 2026-05-24 | ERD 툴 확정 — 온라인: DrawDB (drawdb.app), 오프라인: DBeaver (Community Edition) |
| 2026-05-24 | Prisma 버전 확정 — `7.8.0` (최신 안정 버전) |
| 2026-05-24 | Ch 2 수업 문서를 3개 파일로 분리 (step-02a / 02b / 02c) |
