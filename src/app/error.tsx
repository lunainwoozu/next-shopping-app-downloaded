"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="empty">
      <p className="empty__title">오류가 발생했습니다</p>
      <p className="empty__sub">{error.message}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={reset} className="btn btn--ghost">
          다시 시도
        </button>
        <Link href="/" className="btn btn--primary">
          홈으로
        </Link>
      </div>
    </div>
  );
}
