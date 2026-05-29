"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function AdminProductsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ADMIN_PRODUCTS_KEY,
    queryFn: fetchAdminProducts,
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      patchProduct(id, { stock }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
      setDeleteConfirmId(null);
      setDeleteError(null);
      setEditProduct(null);
    },
    onError: (err: Error) => setDeleteError(err.message),
  });

  const handleSuccess = () =>
    queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });

  /* ── 로딩 ── */
  if (isLoading) {
    return (
      <div>
        <div className="section-head">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  /* ── 에러 ── */
  if (isError) {
    return (
      <div className="empty">
        <p className="empty__title">불러오지 못했습니다</p>
        <p className="empty__sub">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="section-head">
        <div>
          <div className="section-head__title">상품 관리</div>
          <div className="section-head__meta">
            {String(products?.length ?? 0).padStart(2, "0")} PRODUCTS
          </div>
        </div>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          + 상품 등록
        </button>
      </div>

      {/* 빈 상태 */}
      {!products || products.length === 0 ? (
        <div className="empty">
          <p className="empty__title">등록된 상품이 없습니다</p>
          <p className="empty__sub">상품을 등록해 목록을 채워보세요</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
             <colgroup>
                <col className="lg:w-10" />
                <col />
                <col className="lg:w-20" />
                <col />
                <col />
                <col />
              </colgroup>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>가격</th>
                <th className="hidden md:table-cell">재고</th>
                <th className="hidden md:table-cell">액션</th>
              </tr>
            </thead>
            <tbody>
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
                    onClick={() => {
                      if (window.innerWidth < 768) setEditProduct(product);
                    }}
                    className="md:cursor-default cursor-pointer"
                  >
                    {/* 이미지 */}
                    <td>
                      <div className="cell-image">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </td>

                    {/* 상품명 */}
                    <td className="cell-name">{product.name}</td>

                    {/* 카테고리 */}
                    <td className="cell-cat">{product.category ?? "—"}</td>

                    {/* 가격 */}
                    <td className="cell-price">
                      {product.price.toLocaleString("ko-KR")}원
                    </td>

                    {/* 재고 스테퍼 */}
                    <td className="cell-stock hidden md:table-cell">
                      <div
                        className="stock-step"
                        data-zero={product.stock === 0}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            stockMutation.mutate({
                              id: product.id,
                              stock: Math.max(0, product.stock - 1),
                            });
                          }}
                          disabled={product.stock === 0 || isStockPending}
                          aria-label="재고 감소"
                        >
                          <Minus size={11} />
                        </button>
                        <span>{product.stock}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            stockMutation.mutate({
                              id: product.id,
                              stock: product.stock + 1,
                            });
                          }}
                          disabled={isStockPending}
                          aria-label="재고 증가"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </td>

                    {/* 액션 */}
                    <td className="cell-actions hidden md:table-cell">
                      {deleteConfirmId === product.id ? (
                        <div className="delete-confirm">
                          {deleteError && (
                            <em>{deleteError}</em>
                          )}
                          <button
                            className="cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(null);
                              setDeleteError(null);
                            }}
                          >
                            취소
                          </button>
                          <button
                            className="confirm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(product.id);
                            }}
                            disabled={isDeletePending}
                          >
                            {isDeletePending ? "삭제 중…" : "확인"}
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditProduct(product);
                            }}
                            className="text-[12px] text-muted-foreground hover:text-foreground hover:underline underline-offset-[3px] px-2 py-1 transition-colors mr-3"
                          >
                            수정
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(product.id);
                              setDeleteError(null);
                            }}
                            className="text-[12px] text-muted-foreground hover:text-destructive hover:underline underline-offset-[3px] px-2 py-1 transition-colors"
                          >
                            삭제
                          </button>
                        </>
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

      {/* 상품 수정 모달 */}
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
