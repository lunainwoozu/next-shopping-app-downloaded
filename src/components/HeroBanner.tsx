"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  const router = useRouter();
  return (
    <section className="hero" data-screen-label="hero">
      <div className="hero__media" style={{ aspectRatio: "21/9" }}>
        <img className="hero__img" src="assets/products/product2.jpg" alt="" />
        <div className="hero__overlay">
          <div className="container" style={{ width: "100%" }}>
            <div className="hero__copy">
              <div className="eyebrow">SS / 26 · NEW ARRIVAL</div>
              <h1>잘 만든 옷,<br/>오래 입는 즐거움.</h1>
              <p>봄 시즌, 매일 손이 가는 기본을 골랐습니다.</p>
              <button className="btn btn--invert" onClick={() => router.push("/products")}>
                컬렉션 보기 <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
