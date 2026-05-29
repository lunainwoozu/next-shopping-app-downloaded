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
      <button
        onClick={() => setOpen(true)}
        className="relative text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        장바구니
        {mounted && totalCount > 0 && (
          <span className="absolute -top-2 -right-4 bg-foreground text-background text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-mono">
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
