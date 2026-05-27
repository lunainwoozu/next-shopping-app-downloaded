import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

/**
 * 관리자 전용 레이아웃
 * - 미들웨어(Edge) + 여기(Node.js) 이중 권한 체크
 * - 사이드바 + 콘텐츠 영역 분리
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // role이 admin이 아니면 홈으로 강제 이동
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* 사이드바 */}
      <aside className="w-44 shrink-0">
        <div className="bg-gray-50 rounded-xl border p-4 sticky top-24">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            관리자 메뉴
          </p>
          <nav className="flex flex-col gap-1">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              📦 상품 관리
            </Link>
          </nav>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
