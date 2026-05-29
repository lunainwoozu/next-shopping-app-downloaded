"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const SIZES = ["XS", "S", "M", "L", "XL"];

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
}

export function ProductDetail({ product }: Props) {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl ?? "",
      });
    }
  }

  return (
    <div className="space-y-8 mt-6">
      {/* 사이즈 선택 */}
      <div>
        <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-mono mb-3">
          SIZE · {size}
        </div>
        <div className="flex gap-2 flex-wrap">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-12 h-12 text-xs tracking-[0.08em] border transition-colors ${
                s === size
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 수량 */}
      <div className="flex items-center gap-4">
        <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-mono w-16">
          QTY
        </div>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            −
          </button>
          <span className="w-10 h-10 flex items-center justify-center text-sm tabular-nums text-foreground border-x border-border">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3 pt-2">
        <button className="flex-1 h-12 border border-foreground text-foreground text-sm hover:bg-foreground hover:text-background transition-colors">
          찜
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-[2] h-12 bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  );
}
