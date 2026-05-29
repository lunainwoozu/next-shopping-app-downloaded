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

## 완료된 항목

_완료 시 이곳에서 삭제 후 `HISTORY.md`에 날짜와 함께 기록_
