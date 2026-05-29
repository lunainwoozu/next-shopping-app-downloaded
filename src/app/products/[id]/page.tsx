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
      <div className="pdp">
        {/* 갤러리 */}
        <div className="pdp__gallery">
          <div className="pdp__hero">
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
          <div className="pdp__thumbs">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="pdp__thumb" data-active={i === 0}>
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
        <div className="pdp__info">
          <nav className="pdp__crumbs">
            <Link href="/">Home</Link>
            {product.category && (
              <>
                <span> / </span>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                >
                  {product.category}
                </Link>
              </>
            )}
            <span> / </span>
            <span>{product.name}</span>
          </nav>

          <h1 className="pdp__name">{product.name}</h1>
          <div className="pdp__price">
            {product.price.toLocaleString("ko-KR")}원
          </div>

          {product.description && (
            <p className="pdp__desc">{product.description}</p>
          )}

          <dl>
            <div className="pdp__row">
              <dt>소재</dt>
              <dd>코튼 100% · 한국 제작</dd>
            </div>
            <div className="pdp__row">
              <dt>배송</dt>
              <dd>주문 후 1-2일 내 출고 · 3만원 이상 무료</dd>
            </div>
            <div className="pdp__row">
              <dt>재고</dt>
              <dd className={`font-mono ${product.stock === 0 ? "text-muted-foreground" : ""}`}>
                {product.stock > 0 ? `${product.stock} · 충분` : "품절"}
              </dd>
            </div>
          </dl>

          {product.stock > 0 ? (
            <ProductDetail product={product} />
          ) : (
            <div className="mt-6 h-12 flex items-center justify-center bg-muted text-muted-foreground text-sm">
              품절된 상품입니다
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24 md:mt-32">
          <div className="section-head pb-6 border-b border-border">
            <div>
              <div className="eyebrow mb-2">RELATED</div>
              <h2 className="section-head__title">함께 보면 좋은 상품</h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
