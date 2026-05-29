import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";
import { CartSection } from "./CartSection";
import { MobileMenu } from "./MobileMenu";

const CATEGORIES = ["상의", "하의", "가방", "신발", "액세서리"];

export async function Header() {
  const session = await auth();

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header__inner">

          {/* 브랜드 로고 */}
          <Link href="/" className="brand">
            SHOP<span className="dot">.</span>
          </Link>

          {/* 데스크톱 카테고리 내비 */}
          <nav className="nav">
            <Link href="/products" className="nav__link">전체</Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/products?category=${encodeURIComponent(c)}`}
                className="nav__link"
              >
                {c}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 영역 */}
          <div className="site-header__right nav-actions">

            {/* 데스크톱 전용: 인증 링크 (모바일에서 숨김) */}
            <div className="nav-actions__extra">
              {session?.user?.role === "admin" && (
                <Link href="/admin/products" className="nav__link nav__link--admin">
                  관리자
                </Link>
              )}
              {session ? (
                <>
                  <Link href="/mypage" className="nav__link">
                    {session.user?.name} 님
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="nav__link">로그인</Link>
                  <Link href="/register" className="btn btn--primary btn--sm">
                    회원가입
                  </Link>
                </>
              )}
            </div>

            {/* 장바구니 (항상 노출) */}
            <CartSection />

            {/* 모바일 햄버거 (≤1024px에서 노출) */}
            <MobileMenu
              userName={session?.user?.name}
              isAdmin={session?.user?.role === "admin"}
              isLoggedIn={!!session}
            />
          </div>

        </div>
      </div>
    </header>
  );
}
