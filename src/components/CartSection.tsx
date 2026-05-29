"use client";

import { useState, useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "./cart/CartDrawer";

const subscribe = () => () => {};

export function CartSection() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const totalCount = useCartStore((s) => s.totalCount());

  return (
    <>
      <button onClick={() => setOpen(true)}>
        장바구니
        {mounted && (
          <span className="cart-count">{totalCount}</span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
