"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { productSchema, ProductInput } from "@/schemas/product.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
};

interface ProductFormModalProps {
  product?: Product; // 없으면 등록 모드, 있으면 수정 모드
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void;   // 수정 모드 + 모바일에서만 표시
  isDeleting?: boolean;
}

async function submitProduct(product: Product | undefined, data: ProductInput) {
  if (product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("상품 수정에 실패했습니다");
    return res.json();
  }

  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("상품 등록에 실패했습니다");
  return res.json();
}

export function ProductFormModal({
  product,
  onClose,
  onSuccess,
  onDelete,
  isDeleting,
}: ProductFormModalProps) {
  const isEdit = !!product;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: isEdit
      ? {
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          stock: product.stock,
          category: product.category ?? "",
          imageUrl: product.imageUrl ?? "",
        }
      : { stock: 0 },
  });

  const mutation = useMutation({
    mutationFn: (data: ProductInput) => submitProduct(product, data),
    onSuccess: () => {
      if (!isEdit) reset();
      onSuccess();
      onClose();
    },
  });

  const handleClose = () => {
    if (!isEdit) reset();
    setConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-5">
          {isEdit ? "상품 수정" : "상품 등록"}
        </h2>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          {/* 상품명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명 <span className="text-red-500">*</span>
            </label>
            <Input {...register("name")} placeholder="상품명을 입력하세요" />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품 설명
            </label>
            <textarea
              {...register("description")}
              placeholder="상품 설명을 입력하세요 (선택)"
              className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* 가격 / 재고 나란히 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 (원) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="10000"
                min={1}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                재고 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="100"
                min={0}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <Input
              {...register("category")}
              placeholder="예: 상의, 하의, 아우터"
            />
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지 URL
            </label>
            <Input {...register("imageUrl")} placeholder="https://..." />
          </div>

          {/* API 에러 */}
          {mutation.isError && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">
              {(mutation.error as Error).message}
            </p>
          )}

          {/* 저장 / 취소 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={mutation.isPending}
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? isEdit ? "저장 중..." : "등록 중..."
                : isEdit ? "저장하기" : "등록하기"}
            </Button>
          </div>
        </form>

        {/* 삭제 버튼 — 모바일 수정 모드 전용 */}
        {isEdit && onDelete && (
          <div className="md:hidden mt-4 pt-4 border-t">
            {confirmDelete ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-red-600 font-medium text-center">
                  정말 삭제할까요?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    disabled={isDeleting}
                    className="flex-1 text-sm py-2 rounded border hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="flex-1 text-sm py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "삭제 중..." : "확인"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full text-sm text-red-500 py-2 rounded border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                상품 삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
