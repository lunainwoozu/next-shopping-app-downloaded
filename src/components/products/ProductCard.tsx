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
    <Link href={`/products/${product.id}`} className="card">
      <div className="card__media">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="card__img"
          />
        )}
        {soldOut && <div className="card__soldout">sold out</div>}
        {!soldOut && (
          <div className="card__hover">
            <AddToCartButton product={product} />
          </div>
        )}
      </div>
      <div className="card__meta">
        <span className="card__cat">{product.category}</span>
        <h3 className="card__name line-clamp-1">{product.name}</h3>
        <span className="card__price">
          {product.price.toLocaleString("ko-KR")}원
        </span>
      </div>
    </Link>
  );
}
