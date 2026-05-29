import Image from "next/image";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; imageUrl: string | null } | null;
}

interface Order {
  id: string;
  totalPrice: number;
  createdAt: string;
  status: { code: string; label: string };
  orderItems: OrderItem[];
}

export function OrderCard({ order }: { order: Order }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="order-card">
      {/* 주문 헤더 */}
      <div className="order-card__head">
        <div className="flex items-baseline gap-4">
          <span className="order-card__num">
            # {order.id.slice(0, 8).toUpperCase()}
          </span>
          <span className="order-card__date">{orderDate}</span>
        </div>
        <span className="order-card__status" data-status={order.status.code}>
          {order.status.label}
        </span>
      </div>

      {/* 상품 썸네일 목록 */}
      <div className="order-card__items">
        {order.orderItems.map((item) => (
          <div key={item.id} className="order-card__thumb">
            {item.product?.imageUrl && (
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* 총 결제금액 */}
      <div className="order-card__total">
        <span>총 결제금액</span>
        <span>{order.totalPrice.toLocaleString("ko-KR")}원</span>
      </div>
    </div>
  );
}
