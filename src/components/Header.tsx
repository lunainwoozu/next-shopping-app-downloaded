import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";
import { CartBadge } from "./CartBadge";
import { MobileMenu } from "./MobileMenu";

const CATEGORIES = ["상의", "하의", "가방", "신발", "액세서리"];

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mmx-auto max-w-[1280px] h-16 px-4 md:px-6 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* 로고 */}
        <Link
          href="/"
          className="justify-self-start text-base font-semibold tracking-[0.24em] text-foreground"
        >
          SHOP<span className="text-primary">.</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-7 justify-self-center">
          <Link
            href="/products"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            전체
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {c}
            </Link>
          ))}
        </nav>

        {/* 데스크톱 인증 영역 */}
        <div className="hidden md:flex items-center gap-5 justify-self-end text-[13px]">
          <CartBadge userId={session?.user?.id} />
          {session?.user?.role === "admin" && (
            <Link
              href="/admin/products"
              className="text-foreground hover:opacity-70"
            >
              관리자
            </Link>
          )}
          {session ? (
            <>
              <span className="text-sm text-gray-600">
                {session.user?.name} 님
              </span>
              <Link
                href="/mypage"
                className="text-muted-foreground hover:text-foreground"
              >
                마이페이지
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="h-9 inline-flex items-center px-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden justify-self-end">
          <MobileMenu
            userName={session?.user?.name}
            isAdmin={session?.user?.role === "admin"}
            isLoggedIn={!!session}
            userId={session?.user?.id}
          />
        </div>
      </div>
    </header>
  );
}
