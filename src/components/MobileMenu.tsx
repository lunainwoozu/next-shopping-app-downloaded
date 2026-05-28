"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CartBadge } from "./CartBadge";
import { SignOutButton } from "./SignOutButton";

type Props = {
  userName?: string | null;
  isAdmin?: boolean;
  isLoggedIn: boolean;
  userId?: string;
};

export function MobileMenu({ userName, isAdmin, isLoggedIn, userId }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 top-16 bg-black/20 z-40"
            onClick={close}
          />

          {/* 드롭다운 */}
          <div className="fixed top-16 left-0 right-0 bg-white border-b shadow-lg z-50 px-6 py-2 flex flex-col">
            <div className="pb-1 flex items-center justify-between">
              {isLoggedIn &&(
                <span className="text-sm text-gray-500 py-3 font-bold">
                  {userName} 님
                </span>
              )}
              {isAdmin && (
                <Link
                  href="/admin/products"
                  className="text-sm text-blue-600 font-medium py-3 hover:text-blue-800"
                  onClick={close}
                >
                  관리자
                </Link>
              )}
            </div>
            <Link
              href="/products"
              className="text-sm text-gray-700 py-3 border-b hover:text-gray-900"
              onClick={close}
            >
              상품 목록
            </Link>

            <div className="py-3 border-b">
              <CartBadge userId={userId} />
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  href="/mypage"
                  className="text-sm text-gray-700 py-3 border-b hover:text-gray-900"
                  onClick={close}
                >
                  마이페이지
                </Link>
                <div className="py-3">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 py-3 border-b hover:text-gray-900"
                  onClick={close}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-gray-900 text-white px-4 py-2.5 rounded-md hover:bg-gray-700 text-center my-3"
                  onClick={close}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
