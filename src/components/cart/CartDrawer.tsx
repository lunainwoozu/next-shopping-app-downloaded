"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "./CartItem";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const items = useCartStore((s) => s.items);
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <>
      <div className="drawer-bd" data-open={open} onClick={onClose} />
      <aside className="drawer" data-open={open} aria-hidden={!open}>
        <div className="drawer__head">
          <h3>장바구니 ({items.length})</h3>
          <button className="drawer__close" onClick={onClose}>닫기</button>
        </div>

        <div className="drawer__body">
          {items.length === 0 ? (
            <div className="pt-12 text-center">
              <div className="eyebrow mb-2">EMPTY</div>
              <p className="text-sm text-muted-foreground">
                장바구니가 비어있습니다.
              </p>
            </div>
          ) : (
            <div className="cart-list">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="drawer__foot">
          <div className="summary__row summary__row--total !mt-0 !pt-0 !border-t-0">
            <span>합계</span>
            <span>{subtotal.toLocaleString("ko-KR")}원</span>
          </div>
          <p className="summary__note mb-4">
            3만원 이상 무료배송. 결제는 다음 단계에서 진행됩니다.
          </p>
          <div className="flex flex-col gap-2">
            <button
              className="btn btn--primary btn--block"
              disabled={items.length === 0}
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
            >
              주문 / 결제하기
            </button>
            <Link
              href="/cart"
              className="btn btn--line btn--block"
              onClick={onClose}
            >
              장바구니 보기
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
