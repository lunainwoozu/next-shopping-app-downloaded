import Link from "next/link";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function OrderCompletePage({ searchParams }: Props) {
  const { id } = await searchParams;

  return (
    <div className="order-done">
      <div className="order-done__mark">Order Confirmed</div>
      <h1>주문 완료</h1>
      {id && (
        <p>
          주문번호 <span className="num">{id.slice(0, 8).toUpperCase()}</span>
        </p>
      )}
      <p>
        주문이 접수되었습니다.<br />
        배송 현황은 마이페이지에서 확인할 수 있습니다.
      </p>
      <div className="order-done__actions">
        <Link href="/mypage" className="btn btn--primary">
          주문 내역 보기
        </Link>
        <Link href="/products" className="btn btn--ghost">
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
