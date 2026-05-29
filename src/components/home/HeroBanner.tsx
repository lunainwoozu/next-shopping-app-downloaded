import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="hero hero--split">
      <div className="hero__copy-pane">
        <div className="eyebrow mb-4">SS / 26 · NEW ARRIVAL</div>
        <h1>
          잘 만든 옷,
          <br />
          오래 입는 즐거움.
        </h1>
        <p>봄 시즌, 매일 손이 가는 기본을 골랐습니다. 천천히 둘러보세요.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className="btn btn--primary">
            컬렉션 보기 <ArrowRight size={14} />
          </Link>
          <Link href="/products?category=상의" className="btn btn--ghost">
            상의만 보기
          </Link>
        </div>
      </div>

      <div className="hero__media">
        <Image
          src="/images/products/product7.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="hero__img"
        />
      </div>
    </section>
  );
}
