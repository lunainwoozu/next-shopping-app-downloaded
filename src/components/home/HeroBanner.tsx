"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[560px] md:min-h-[640px]">
      {/* 좌: 카피 */}
      <div className="flex flex-col justify-center px-6 md:px-16 py-16 md:py-24">
        <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-mono mb-4">
          SS / 26 · NEW ARRIVAL
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-foreground mb-6">
          잘 만든 옷,
          <br />
          오래 입는 즐거움.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-md mb-10">
          봄 시즌, 매일 손이 가는 기본을 골랐습니다. 천천히 둘러보세요.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-6 bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
          >
            컬렉션 보기 <ArrowRight size={14} />
          </Link>
          <Link
            href="/products?category=상의"
            className="inline-flex items-center h-12 px-6 border border-foreground text-foreground text-sm hover:bg-foreground hover:text-background transition-colors"
          >
            상의만 보기
          </Link>
        </div>
      </div>

      {/* 우: 이미지 */}
      <div className="relative bg-secondary min-h-[400px] md:min-h-0">
        <Image
          src="/images/products/product7.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
