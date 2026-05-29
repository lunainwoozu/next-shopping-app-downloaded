import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground text-sm">
        상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-6 md:gap-y-1">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4} // 처음 4개 상품 이미지는 최우선 로딩(LCP 최적화)
        />
      ))}
    </div>
  );
}
