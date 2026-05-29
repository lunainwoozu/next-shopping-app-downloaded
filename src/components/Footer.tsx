import Link from "next/link";

const COLS = [
  {
    h: "Shop",
    links: [
      { t: "전체 상품", href: "/products" },
      { t: "상의", href: "/products?category=상의" },
      { t: "하의", href: "/products?category=하의" },
      { t: "가방", href: "/products?category=가방" },
    ],
  },
  {
    h: "Account",
    links: [
      { t: "로그인", href: "/login" },
      { t: "회원가입", href: "/register" },
      { t: "주문 내역", href: "/mypage" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr] gap-10">
          <div>
            <div className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground font-mono mb-4">
              SHOP.
            </div>
            <p className="text-[13px] text-muted-foreground max-w-[28ch]">
              매일 입는 옷, 매일 드는 가방. 오래도록 좋은 물건만 모아
              소개합니다.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.h}>
              <h4 className="text-[11px] tracking-[0.14em] uppercase text-foreground mb-4">
                {col.h}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.t}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex justify-between text-[11px] text-muted-foreground">
          <span>© 2026 SHOP. All rights reserved.</span>
          <span className="font-mono">KR · KRW</span>
        </div>
      </div>
    </footer>
  );
}
