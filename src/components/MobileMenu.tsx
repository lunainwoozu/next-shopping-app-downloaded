"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const CATEGORIES = ["상의", "하의", "가방", "신발", "액세서리"];

type Props = {
  userName?: string | null;
  isAdmin?: boolean;
  isLoggedIn: boolean;
};

export function MobileMenu({ userName, isAdmin, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* 햄버거 버튼 (≤1024px에서만 노출) */}
      <button
        className="hamburger"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* 배경 오버레이 */}
      <div className="mobile-menu-bd" data-open={open} onClick={close} />

      {/* 드롭다운 패널 */}
      <nav className="mobile-menu" data-open={open}>
        <div className="container">
          {isLoggedIn && userName && (
            <div className="mobile-menu__user">
              <strong>{userName}</strong> 님, 안녕하세요!
            </div>
          )}

          <Link href="/products" className="mobile-menu__link" onClick={close}>
            전체 상품 <ArrowRight size={14} className="arr" />
          </Link>

          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="mobile-menu__link"
              onClick={close}
            >
              {c} <ArrowRight size={14} className="arr" />
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin/products"
              className="mobile-menu__link mobile-menu__link--admin"
              onClick={close}
            >
              관리자 <ArrowRight size={14} className="arr" />
            </Link>
          )}

          <div className="mobile-menu__cta">
            {isLoggedIn ? (
              <>
                <Link
                  href="/mypage"
                  className="btn btn--line btn--block"
                  onClick={close}
                >
                  마이페이지
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn--line btn--block"
                  onClick={close}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="btn btn--primary btn--block"
                  onClick={close}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
