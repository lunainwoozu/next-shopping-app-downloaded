import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty">
      <p className="eyebrow mb-4">404</p>
      <p className="empty__title">페이지를 찾을 수 없습니다</p>
      <p className="empty__sub">
        주소가 잘못되었거나 삭제된 페이지입니다
      </p>
      <Link href="/" className="btn btn--primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
