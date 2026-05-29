import { prisma } from "@/lib/db";
import { HeroBanner } from "@/components/home/HeroBanner";
import { ProductGrid } from "@/components/products/ProductGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [featured, rest] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      skip: 4,
    }),
  ]);

  return (
    <div>
      <HeroBanner />

      <section className="mx-auto max-w-[1280px] px-4 md:px-6 mt-16 md:mt-24">
        <div className="section-head pb-6 border-b border-border">
          <div>
            <div className="eyebrow mb-2">EDITOR&apos;S PICK</div>
            <h2 className="section-head__title">이번 주의 선택</h2>
          </div>
          <Link href="/products" className="section-head__right">
            전체 보기 <ArrowRight size={12} />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto max-w-[1280px] px-4 md:px-6 mt-20 md:mt-28">
        <div className="section-head pb-6 border-b border-border">
          <div>
            <div className="eyebrow mb-2">NEW IN</div>
            <h2 className="section-head__title">신상품</h2>
          </div>
          <span className="section-head__meta">
            {String(rest.length).padStart(2, "0")} ITEMS
          </span>
        </div>
        <ProductGrid products={rest} />
      </section>
    </div>
  );
}
