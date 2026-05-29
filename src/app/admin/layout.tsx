import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/");

  return (
    <div className="admin-grid">
      <aside className="admin-side">
        <div className="eyebrow">관리자</div>
        <Link href="/admin/products" data-active="true">
          상품 관리 <span className="badge">→</span>
        </Link>
      </aside>
      <div>{children}</div>
    </div>
  );
}
