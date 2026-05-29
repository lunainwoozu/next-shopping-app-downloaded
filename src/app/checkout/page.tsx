"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cartStore";
import { orderSchema, OrderFormData } from "@/schemas/order.schema";
import { useEffect } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const onSubmit = async (data: OrderFormData) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "주문 처리 중 오류가 발생했습니다");
        return;
      }

      const { orderId } = await response.json();
      clearCart();
      router.push(`/order-complete?id=${orderId}`);
    } catch {
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <div className="pb-6">
        <div className="eyebrow mb-3">Checkout</div>
        <h1 className="text-[28px] font-normal tracking-[-0.01em]">
          주문하기
        </h1>
      </div>

      <div className="checkout">
        {/* ── 좌: 배송지 폼 ─────────────────────────── */}
        <div>
          <div className="panel">
            <div className="panel__head">
              <span className="panel__title">배송지 정보</span>
              <span className="panel__num">01</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="field">
                <label htmlFor="receiverName">받는 분</label>
                <input
                  id="receiverName"
                  {...register("receiverName")}
                  placeholder="홍길동"
                />
                {errors.receiverName && (
                  <span className="text-xs text-destructive">
                    {errors.receiverName.message}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="receiverPhone">전화번호</label>
                <input
                  id="receiverPhone"
                  {...register("receiverPhone")}
                  placeholder="010-1234-5678"
                />
                {errors.receiverPhone && (
                  <span className="text-xs text-destructive">
                    {errors.receiverPhone.message}
                  </span>
                )}
              </div>

              <div className="field">
                <label htmlFor="address">배송 주소</label>
                <input
                  id="address"
                  {...register("address")}
                  placeholder="서울시 강남구 테헤란로 123"
                />
                {errors.address && (
                  <span className="text-xs text-destructive">
                    {errors.address.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn--primary btn--block mt-6"
              >
                {isSubmitting ? "처리 중..." : "결제하기"}
              </button>
            </form>
          </div>
        </div>

        {/* ── 우: 주문 요약 ─────────────────────────── */}
        <div>
          <div className="panel">
            <div className="panel__head">
              <span className="panel__title">주문 상품</span>
              <span className="panel__num">02</span>
            </div>

            <div>
              {items.map((item) => (
                <div key={item.id} className="order-summary__row">
                  <div className="order-summary__media">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="order-summary__name">
                    {item.name}
                    <div className="sub">수량 {item.quantity}</div>
                  </div>
                  <div className="order-summary__price">
                    {(item.price * item.quantity).toLocaleString("ko-KR")}원
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary">
            <h3>결제 금액</h3>
            <div className="summary__row">
              <span>상품 금액</span>
              <span>{totalPrice().toLocaleString("ko-KR")}원</span>
            </div>
            <div className="summary__row">
              <span>배송비</span>
              <span>무료</span>
            </div>
            <div className="summary__row summary__row--total">
              <span>총 결제금액</span>
              <span>{totalPrice().toLocaleString("ko-KR")}원</span>
            </div>
            <p className="summary__note">주문 후 3–5 영업일 이내 배송됩니다</p>
          </div>
        </div>
      </div>
    </>
  );
}
