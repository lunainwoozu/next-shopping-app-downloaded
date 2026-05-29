# REFACTOR.md

마이그레이션 진행 중 발견된 리팩터링 과제를 기록합니다.
완료된 항목은 `docs/HISTORY.md`로 이동합니다.

---

## 미완료 리팩터링 과제

### [Admin] 재고 스테퍼 Client Component 분리

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/app/admin/products/page.tsx` |
| 현재 상태 | 페이지 전체가 `"use client"` — TanStack Query, mutation, 모달 상태 등을 한 파일에서 관리 |
| 목표 | `ProductDetail` 패턴처럼 RSC + 최소 Client Component로 분리 |
| 분리 대상 | 재고 스테퍼(`StockStepper`), 삭제 확인(`DeleteConfirm`), 모달 트리거 버튼 → 각각 `"use client"` 컴포넌트로 추출 |
| 이유 | 목록 테이블은 서버에서 렌더하고, 상호작용 단위만 클라이언트로 격리하면 초기 렌더 성능 향상 및 구조 명확화 |
| 참고 | `src/app/products/[id]/page.tsx` — 상품 상세는 RSC, 담기 버튼만 `AddToCartButton` Client Component로 분리된 구조 |

---

### [ProductFormModal] 530px 이하 가격/재고 입력 필드 오버플로우

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/admin/ProductFormModal.tsx` |
| 현재 상태 | 가격·재고 필드를 `.modal__row`(2열 그리드)로 나란히 배치 |
| 증상 | 530px 이하 화면에서 두 필드가 모달 너비를 초과해 튀어나옴 |
| 해결 방향 | `@media (max-width: 530px)`에서 `.modal__row`를 1열로 전환하거나, Tailwind `grid-cols-1 sm:grid-cols-2` 반응형 클래스 적용 |

---

### [ProductFormModal] 삭제 확인을 별도 모달로 분리

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/admin/ProductFormModal.tsx` |
| 현재 상태 | 삭제 버튼 클릭 시 `modal__actions` 영역 내에서 `.delete-confirm` 인라인 UI로 교체 |
| 문제 | 액션 영역이 좁아 텍스트가 겹치고, UX상 삭제 의도가 명확히 전달되지 않음 |
| 해결 방향 | 삭제 확인을 별도 `DeleteConfirmModal` 컴포넌트(새 모달)로 분리. 삭제 버튼 클릭 → 확인 모달 오픈 → 확인/취소 선택 흐름으로 변경 |

---

### [CartDrawer] cart-list 가로 스크롤 발생

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/cart/CartDrawer.tsx` |
| 현재 상태 | `.drawer__body` 안의 `.cart-list` 또는 `.cart-item` 요소가 드로어 너비(420px)를 초과하여 수평 스크롤바 발생 |
| 증상 | CartDrawer를 열었을 때 내용이 가로로 넘쳐 `.drawer` 외부까지 레이아웃이 밀림 |
| 해결 방향 | `.drawer__body`에 `overflow-x: hidden` 추가, 또는 `.cart-item` 그리드/플렉스 컬럼 너비를 `minmax(0, 1fr)` 등으로 제한. `.cart-item__img` 고정 너비가 원인일 수 있으므로 확인 필요 |

---

### [ProductDetail] loading.tsx 스켈레톤과 실제 레이아웃 불일치

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/app/products/[id]/loading.tsx` |
| 현재 상태 | loading 스켈레톤 UI가 실제 `ProductDetail` 레이아웃(`.pdp`, `.pdp__gallery`, `.pdp__info` 등)과 구조적으로 다름 |
| 증상 | 페이지 로딩 중 레이아웃이 크게 달라 보여 사용자에게 어색한 전환 경험 발생 |
| 해결 방향 | `loading.tsx` 스켈레톤을 `products/[id]/page.tsx`의 실제 DOM 구조(`.pdp` 2열 레이아웃, 썸네일 열, 정보 열)에 맞게 재작성 |

---

### [HeroBanner] 컬렉션 보기 버튼 텍스트 색상 오류

| 항목 | 내용 |
| --- | --- |
| 파일 | `src/components/home/HeroBanner.tsx` |
| 현재 상태 | 컬렉션 보기 버튼의 텍스트 색상이 배경색과 대비가 맞지 않아 가독성 저하 |
| 증상 | 버튼 레이블이 배경에 묻혀 잘 보이지 않음 |
| 해결 방향 | 버튼 클래스(`.btn--ghost` 또는 `.btn--outline`) 확인 후 `--ink` / `--bg` 토큰 기준으로 색상 수정 또는 적절한 btn variant 클래스로 교체 |

---

## 완료된 항목

_완료 시 이곳에서 삭제 후 `HISTORY.md`에 날짜와 함께 기록_
