"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── 슬라이드 데이터 ───────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    title: "신상품 도착 🆕",
    subtitle: "이번 시즌 최신 트렌드를 가장 먼저 만나보세요",
    cta: "신상품 보러 가기",
    href: "/",
    bg: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: 2,
    title: "특가 세일 진행 중 🔥",
    subtitle: "놓치면 후회할 한정 특가, 지금 바로 확인하세요",
    cta: "세일 상품 보기",
    href: "/",
    bg: "from-orange-400 via-red-500 to-rose-500",
  },
  {
    id: 3,
    title: "아우터 컬렉션 🧥",
    subtitle: "이 계절에 꼭 필요한 아이템을 모아봤어요",
    cta: "컬렉션 보기",
    href: "/",
    bg: "from-emerald-400 via-teal-500 to-cyan-500",
  },
];

const AUTO_PLAY_INTERVAL = 4000; // 4초

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  // 자동 재생 — 마우스 호버 시 일시정지
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-10 h-72 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── 슬라이드 트랙 ── */}
      {/* flex + translateX로 슬라이드 이동. transition-transform으로 부드럽게 */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full h-full bg-gradient-to-r ${slide.bg} flex flex-col items-center justify-center text-white px-8 text-center`}
          >
            <h2 className="text-4xl font-extrabold mb-3 drop-shadow-md">
              {slide.title}
            </h2>
            <p className="text-lg mb-7 opacity-90 max-w-md">{slide.subtitle}</p>
            <Link
              href={slide.href}
              className="px-7 py-2.5 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors shadow-md"
            >
              {slide.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* ── 이전 버튼 ── */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* ── 다음 버튼 ── */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── 인디케이터 점 ── */}
      {/* 현재 슬라이드: 길쭉한 흰 바 / 나머지: 작은 반투명 원 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
