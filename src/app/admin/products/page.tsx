"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductFormModal } from "@/components/admin/ProductFormModal";

const ADMIN_PRODUCTS_KEY = ["admin", "products"] as const;

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
};

// ── API 함수 ─────────────────────────────────────────────────

async function fetchAdminProducts(): Promise<Product[]> {
  const res = await fetch("/api/admin/products");
  if (!res.ok) throw new Error("상품 목록을 불러오지 못했습니다");
  return res.json();
}

async function patchProduct(id: string, data: Partial<Product>) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("수정에 실패했습니다");
  return res.json();
}

async function deleteProductApi(id: string) {
  const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "삭제에 실패했습니다");
  return data;
}

// ── 페이지 컴포넌트 ───────────────────────────────────────────

export default function AdminProductsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  // 삭제 2단계 확인: 해당 상품 id를 저장, null이면 일반 버튼 노출
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ADMIN_PRODUCTS_KEY,
    queryFn: fetchAdminProducts,
  });

  // ── 재고 조절 mutation ──────────────────────────────────────
  const stockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      patchProduct(id, { stock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
    },
  });

  // ── 삭제 mutation ────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      setDeleteConfirmId(null);
      setDeleteError(null);
      setEditProduct(null); // 모달에서 삭제 시 모달도 닫기
    },
    onError: (err: Error) => {
      setDeleteError(err.message);
    },
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
  };

  /* ── 로딩 ── */
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  /* ── 에러 ── */
  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  /* ── 정상 ── */
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">상품 관리</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            총 {products?.length ?? 0}개의 상품
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>+ 상품 등록</Button>
      </div>

      {/* 상품 없을 때 */}
      {!products || products.length === 0 ? (
        <div className="text-center py-24 border rounded-xl text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>등록된 상품이 없습니다</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-16">
                  이미지
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  상품명
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  카테고리
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">
                  가격
                </th>
                {/* 재고 열 — 모바일 숨김 */}
                <th className="hidden md:table-cell text-center px-4 py-3 font-medium text-gray-500 w-36">
                  재고
                </th>
                <th className="hidden md:table-cell text-center px-4 py-3 font-medium text-gray-500 w-28">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => {
                const isStockPending =
                  stockMutation.isPending &&
                  stockMutation.variables?.id === product.id;

                const isDeletePending =
                  deleteMutation.isPending &&
                  deleteMutation.variables === product.id;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* 이미지 */}
                    <td className="px-4 py-3">
                      {product.imageUrl ? (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                          없음
                        </div>
                      )}
                    </td>

                    {/* 상품명 — 모바일에서 클릭 시 수정 모달 */}
                    <td
                      className="px-4 py-3 font-medium cursor-pointer hover:text-blue-600 md:cursor-default md:hover:text-inherit"
                      onClick={() => {
                        if (window.innerWidth < 768) setEditProduct(product);
                      }}
                    >
                      {product.name}
                    </td>

                    {/* 카테고리 */}
                    <td className="px-4 py-3 text-gray-500">
                      {product.category ?? "—"}
                    </td>

                    {/* 가격 */}
                    <td className="px-4 py-3 text-right">
                      {product.price.toLocaleString()}원
                    </td>

                    {/* 재고 — 인라인 스테퍼 (모바일 숨김) */}
                    <td className="hidden md:table-cell px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            stockMutation.mutate({
                              id: product.id,
                              stock: Math.max(0, product.stock - 1),
                            })
                          }
                          disabled={product.stock === 0 || isStockPending}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="재고 감소"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span
                          className={`w-10 text-center font-medium tabular-nums ${
                            product.stock === 0 ? "text-red-500" : "text-gray-800"
                          } ${isStockPending ? "opacity-50" : ""}`}
                        >
                          {product.stock}
                        </span>

                        <button
                          onClick={() =>
                            stockMutation.mutate({
                              id: product.id,
                              stock: product.stock + 1,
                            })
                          }
                          disabled={isStockPending}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="재고 증가"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* 액션 — 수정 / 삭제 (2단계 확인, 모바일 숨김) */}
                    <td className="hidden md:table-cell px-4 py-3">
                      {deleteConfirmId === product.id ? (
                        /* 삭제 확인 상태 */
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-xs text-red-600 font-medium whitespace-nowrap">
                            정말 삭제할까요?
                          </span>
                          {deleteError && deleteMutation.variables === product.id && (
                            <span className="text-xs text-red-500 text-center">
                              {deleteError}
                            </span>
                          )}
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                setDeleteConfirmId(null);
                                setDeleteError(null);
                              }}
                              className="text-xs px-2.5 py-1 rounded border hover:bg-gray-50 transition-colors"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => deleteMutation.mutate(product.id)}
                              disabled={isDeletePending}
                              className="text-xs px-2.5 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                              {isDeletePending ? "삭제 중…" : "확인"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* 기본 상태 */
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditProduct(product)}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                            title="수정"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmId(product.id);
                              setDeleteError(null);
                            }}
                            className="p-1.5 rounded hover:bg-red-50 text-red-400 transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 상품 등록 모달 */}
      {isAddModalOpen && (
        <ProductFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* 상품 수정 모달 — 마운트/언마운트로 폼 초기화 */}
      {editProduct && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={handleSuccess}
          onDelete={() => deleteMutation.mutate(editProduct.id)}
          isDeleting={
            deleteMutation.isPending &&
            deleteMutation.variables === editProduct.id
          }
        />
      )}
    </div>
  );
}
