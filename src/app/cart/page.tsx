"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  return (
    <div className="pt-8">
      <div className="section-head">
        <div>
          <div className="eyebrow mb-2">CART</div>
          <h2 className="section-head__title">장바구니</h2>
        </div>
        <span className="section-head__meta">
          {String(items.length).padStart(2, "0")} ITEMS
        </span>
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <div className="empty__title">장바구니가 비어있습니다</div>
          <div className="empty__sub">마음에 드는 상품을 찾아 담아보세요.</div>
          <Link href="/products" className="btn btn--ghost mt-4">
            전체 상품 보기
          </Link>
        </div>
      ) : (
        <div className="cart">
          <div className="cart-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <CartSummary />
        </div>
      )}
    </div>
  );
}
