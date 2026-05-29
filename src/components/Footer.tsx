import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="eyebrow">SHOP.</div>
            <p>매일 입는 옷, 매일 드는 가방. 오래도록 좋은 물건만 모아 소개합니다.</p>
          </div>
          <div className="site-footer__col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="#/products">전체 상품</Link></li>
              <li><Link href="#/products?c=상의">상의</Link></li>
              <li><Link href="#/products?c=하의">하의</Link></li>
              <li><Link href="#/products?c=가방">가방</Link></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Account</h4>
            <ul>
              <li><Link href="#/login">로그인</Link></li>
              <li><Link href="#/register">회원가입</Link></li>
              <li><Link href="#/mypage">주문 내역</Link></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Service</h4>
            <ul>
              <li><Link href="#">고객센터</Link></li>
              <li><Link href="#">배송 / 반품</Link></li>
              <li><Link href="#">이용약관</Link></li>
              <li><Link href="#">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 SHOP. All rights reserved.</span>
          <span className="mono">KR · KRW</span>
        </div>
      </div>
    </footer>
  );
}
