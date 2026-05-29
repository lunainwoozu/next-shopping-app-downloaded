"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export function CartSummary() {
  const items = useCartStore((s) => s.items);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 30000 ? 0 : 3000;
  const total = subtotal + shipping;

  return (
    <aside className="summary">
      <h3>Order Summary</h3>
      <div className="summary__row">
        <span>상품 금액</span>
        <span>{subtotal.toLocaleString("ko-KR")}원</span>
      </div>
      <div className="summary__row">
        <span>배송비</span>
        <span>{shipping === 0 ? "무료" : `${shipping.toLocaleString("ko-KR")}원`}</span>
      </div>
      <div className="summary__row summary__row--total">
        <span>합계</span>
        <span>{total.toLocaleString("ko-KR")}원</span>
      </div>
      <p className="summary__note">3만원 이상 주문 시 무료배송.</p>
      <Link href="/checkout" className="btn btn--primary btn--block btn--lg">
        주문 / 결제하기
      </Link>
    </aside>
  );
}
