"use client";

import { useCartStore } from "@/store/cartStore";

interface Props {
  product: { id: string; name: string; price: number; imageUrl: string | null };
}

export function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl ?? "",
        });
      }}
      className="card__add"
    >
      장바구니 담기
    </button>
  );
}
