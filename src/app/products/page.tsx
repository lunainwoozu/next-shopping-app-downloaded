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

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-8 md:pt-12">
      <div className="section-head pb-6 border-b border-border">
        <div>
          <div className="eyebrow mb-2">{query ? "SEARCH" : "SHOP"}</div>
          <h1 className="section-head__title">
            {query ? `"${query}" 검색 결과` : (category ?? "전체 상품")}
          </h1>
        </div>
        <span className="section-head__meta">
          {String(products.length).padStart(2, "0")} ITEMS
        </span>
      </div>

      {!query && (
        <div className="chips">
          <Link href="/products" className="chip" data-active={!category}>
            전체
          </Link>
          {categoryList.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className="chip"
              data-active={category === cat}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty">
          <p className="empty__sub">
            {query
              ? `"${query}"에 대한 결과가 없습니다.`
              : "상품이 없습니다."}
          </p>
          <Link href="/products" className="btn btn--ghost mt-4">
            전체 상품 보기
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
