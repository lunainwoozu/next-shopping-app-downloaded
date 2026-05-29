import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductGrid } from "@/components/products/ProductGrid";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const related = product.category
    ? await prisma.product.findMany({
        where: { category: product.category, NOT: { id } },
        take: 4,
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-8 md:pt-12">
      {/* PDP 2컬럼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        {/* 갤러리 */}
        <div className="space-y-2">
          <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`relative aspect-square bg-secondary overflow-hidden border-2 transition-colors ${
                  i === 0 ? "border-foreground" : "border-transparent"
                }`}
              >
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    sizes="15vw"
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="py-2">
          {/* 브레드크럼 */}
          <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
            {product.name}
          </h1>
          <div className="text-2xl font-semibold tabular-nums text-foreground mb-6">
            {product.price.toLocaleString("ko-KR")}원
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-[50ch]">
              {product.description}
            </p>
          )}

          {/* 스펙 행 */}
          <dl className="border-t border-border">
            <div className="grid grid-cols-[120px_1fr] py-4 border-b border-border text-sm">
              <dt className="text-muted-foreground">소재</dt>
              <dd className="text-foreground">코튼 100% · 한국 제작</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] py-4 border-b border-border text-sm">
              <dt className="text-muted-foreground">배송</dt>
              <dd className="text-foreground">
                주문 후 1-2일 내 출고 · 3만원 이상 무료
              </dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] py-4 border-b border-border text-sm">
              <dt className="text-muted-foreground">재고</dt>
              <dd
                className={`font-mono ${product.stock === 0 ? "text-muted-foreground" : "text-foreground"}`}
              >
                {product.stock > 0 ? `${product.stock} · 충분` : "품절"}
              </dd>
            </div>
          </dl>

          {/* 사이즈·수량·담기 — Client */}
          {product.stock > 0 ? (
            <ProductDetail product={product} />
          ) : (
            <div className="mt-6 h-12 flex items-center justify-center bg-muted text-muted-foreground text-sm">
              품절된 상품입니다
            </div>
          )}
        </div>
      </div>

      {/* 연관 상품 */}
      {related.length > 0 && (
        <div className="mt-24 md:mt-32">
          <div className="flex items-end justify-between gap-6 mb-8 pb-6 border-b border-border">
            <div>
              <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-mono mb-2">
                RELATED
              </div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                함께 보면 좋은 상품
              </h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
