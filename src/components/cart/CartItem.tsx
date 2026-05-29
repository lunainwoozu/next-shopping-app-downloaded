"use client";

import { useCartStore, CartItem as CartItemType } from "@/store/cartStore";

interface Props {
  item: CartItemType;
}

export function CartItem({ item }: Props) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="cart-item">
      <div className="cart-item__media">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} />
        )}
      </div>
      <div className="cart-item__meta">
        <div className="name">{item.name}</div>
        <div className="price">{item.price.toLocaleString("ko-KR")}원</div>
      </div>
      <div className="cart-item__controls">
        <div className="cart-item__qty">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
        <div className="cart-item__line">
          {(item.price * item.quantity).toLocaleString("ko-KR")}원
        </div>
        <button
          className="cart-item__remove"
          onClick={() => removeItem(item.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
