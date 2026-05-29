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
    <div className="mt-6">
      {/* 사이즈 선택 */}
      <div className="mb-8">
        <div className="eyebrow mb-3">SIZE · {size}</div>
        <div className="pill-chips">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className="pill-chip"
              data-active={s === size}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 수량 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="eyebrow">QTY</div>
        <div className="pdp__qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input type="text" value={qty} readOnly />
          <button onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="pdp__actions">
        <button className="btn btn--ghost">찜</button>
        <button onClick={handleAddToCart} className="btn btn--primary">
          장바구니 담기
        </button>
      </div>
    </div>
  );
}
