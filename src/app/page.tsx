import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HeroBanner } from "@/components/HeroBanner";
import { Footer } from "@/components/Footer";

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    where: { category: { not: null } },
  });

  const categoryList = categories
    .map((p) => p.category)
    .filter(Boolean) as string[];

  return (
    <div>
      {/* 히어로 배너 슬라이더 */}
      <HeroBanner />

      <h1 className="text-2xl font-bold mb-6">전체 상품</h1>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm border transition-colors ${
            !category
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
          }`}
        >
          전체
        </Link>
        {categoryList.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              category === cat
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* 상품 목록 */}
      <ProductGrid products={products} />

      <Footer />
    </div>
  );
}
