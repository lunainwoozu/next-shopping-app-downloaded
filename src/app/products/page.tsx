import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/products/ProductGrid";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category, q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
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

  const chipBase =
    "px-3 py-1.5 text-[11px] tracking-[0.08em] uppercase border transition-colors";
  const chipActive = "bg-foreground text-background border-foreground";
  const chipIdle =
    "border-border text-muted-foreground hover:border-foreground hover:text-foreground";

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-8 md:pt-12">
      {/* 섹션 헤드 */}
      <div className="flex items-end justify-between gap-6 mb-8 pb-6 border-b border-border">
        <div>
          <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-mono mb-2">
            {query ? "SEARCH" : "SHOP"}
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {query ? `"${query}" 검색 결과` : (category ?? "전체 상품")}
          </h1>
        </div>
        <span className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-mono whitespace-nowrap">
          {String(products.length).padStart(2, "0")} ITEMS
        </span>
      </div>

      {/* 카테고리 칩 — 검색 중엔 숨김 */}
      {!query && (
        <div className="flex gap-2 mb-10 flex-wrap">
          <Link
            href="/products"
            className={`${chipBase} ${!category ? chipActive : chipIdle}`}
          >
            전체
          </Link>
          {categoryList.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className={`${chipBase} ${category === cat ? chipActive : chipIdle}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* 상품 목록 / 빈 상태 */}
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {query
              ? `"${query}"에 대한 결과가 없습니다.`
              : "상품이 없습니다."}
          </p>
          <Link
            href="/products"
            className="text-xs tracking-[0.08em] uppercase underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            전체 상품 보기
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
