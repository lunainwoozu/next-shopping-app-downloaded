import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const soldOut = product.stock === 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      {/* 미디어 — 4:5 세로 비율 */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 text-xs tracking-[0.15em] uppercase text-muted-foreground">
            sold out
          </div>
        )}

        {!soldOut && (
          <div className="absolute inset-x-2 bottom-2 flex gap-2 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <AddToCartButton product={product} />
          </div>
        )}
      </div>

      {/* 메타 — 카테고리 / 이름 / 가격 */}
      <div className="flex flex-col gap-1 pt-3">
        <span className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground font-mono">
          {product.category}
        </span>
        <h3 className="text-sm text-foreground line-clamp-1">{product.name}</h3>
        <span className="text-sm text-foreground tabular-nums">
          {product.price.toLocaleString("ko-KR")}원
        </span>
      </div>
    </Link>
  );
}
