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
      {/* 히어로 배너 슬라이더 */}
      <HeroBanner />

      <section className="mx-auto max-w-[1280px] px-4 md:px-6 mt-16 md:mt-24">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-12 pb-6 border-b border-gray-200">
          <div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-gray-500 font-mono mb-2">
              EDITOR&apos;S PICK
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
              이번 주의 선택
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
          >
            {"전체 보기"} <ArrowRight size={12} />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto max-w-[1280px] px-4 md:px-6 mt-20 md:mt-28">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-12 pb-6 border-b border-gray-200">
          <div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-gray-500 font-mono mb-2">
              EDITOR&apos;S PICK
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
              이번 주의 선택
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
          >
            {"전체 보기"} <ArrowRight size={12} />
          </Link>
        </div>
        <ProductGrid products={featured} />

        <div className="flex items-end justify-between gap-6 mb-8 md:mb-12 pb-6 border-b border-gray-200">
          <div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-gray-500 font-mono mb-2">
              NEW IN
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
              신상품
            </h2>
          </div>
          <span className="text-[11px] tracking-[0.12em] uppercase text-gray-500 font-mono whitespace-nowrap">
            {`${String(rest.length).padStart(2, "0")} ITEMS`}
          </span>
        </div>
        <ProductGrid products={rest} />
      </section>
    </div>
  );
}
