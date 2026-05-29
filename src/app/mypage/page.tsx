"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/mypage/OrderCard";
import Link from "next/link";

async function fetchOrders() {
  const response = await fetch("/api/orders");
  if (!response.ok) throw new Error("주문 내역을 불러오는 데 실패했습니다");
  return response.json();
}

export default function MyPage() {
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  return (
    <div className="mypage-grid">

      {/* 사이드 내비 */}
      <aside className="sidenav">
        <div className="eyebrow">마이페이지</div>
        <Link href="/mypage" data-active="true">주문 내역</Link>
      </aside>

      {/* 주문 목록 */}
      <div>
        <div className="section-head">
          <span className="section-head__title">주문 내역</span>
          {!isLoading && !isError && (
            <span className="section-head__meta">
              {String(orders?.length ?? 0).padStart(2, "0")} ORDERS
            </span>
          )}
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        )}

        {/* 에러 */}
        {isError && (
          <div className="empty">
            <p className="empty__title">불러오지 못했습니다</p>
            <p className="empty__sub">{(error as Error).message}</p>
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && !isError && orders?.length === 0 && (
          <div className="empty">
            <p className="empty__title">주문 내역이 없습니다</p>
            <p className="empty__sub">첫 번째 주문을 시작해 보세요</p>
            <Link href="/products" className="btn btn--primary">
              쇼핑하러 가기
            </Link>
          </div>
        )}

        {/* 주문 카드 목록 */}
        {!isLoading && !isError && orders?.length > 0 && (
          <div>
            {orders.map((order: Parameters<typeof OrderCard>[0]["order"]) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
