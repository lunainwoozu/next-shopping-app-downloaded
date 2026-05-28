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
              <li><a href="#/products">전체 상품</a></li>
              <li><a href="#/products?c=상의">상의</a></li>
              <li><a href="#/products?c=하의">하의</a></li>
              <li><a href="#/products?c=가방">가방</a></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Account</h4>
            <ul>
              <li><a href="#/login">로그인</a></li>
              <li><a href="#/register">회원가입</a></li>
              <li><a href="#/mypage">주문 내역</a></li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h4>Service</h4>
            <ul>
              <li><a href="#">고객센터</a></li>
              <li><a href="#">배송 / 반품</a></li>
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보처리방침</a></li>
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
