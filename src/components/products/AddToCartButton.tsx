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
        e.preventDefault(); // 카드 Link 이동 막기
        e.stopPropagation();
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl ?? "",
        });
      }}
      className="flex-1 h-11 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
    >
      장바구니 담기
    </button>
  );
}
