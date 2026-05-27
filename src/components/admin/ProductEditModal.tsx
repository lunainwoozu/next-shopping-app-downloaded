"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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

interface ProductEditModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

async function patchProduct(id: string, data: ProductInput) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("상품 수정에 실패했습니다");
  return res.json();
}

export function ProductEditModal({
  product,
  onClose,
  onSuccess,
}: ProductEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    // 기존 값으로 폼 초기화 (null → "" 변환)
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      stock: product.stock,
      category: product.category ?? "",
      imageUrl: product.imageUrl ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProductInput) => patchProduct(product.id, data),
    onSuccess: () => {
      onSuccess(); // 목록 invalidate
      onClose();   // 모달 닫기
    },
  });

  const onSubmit = (data: ProductInput) => mutation.mutate(data);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-5">상품 수정</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* API 에러 표시 */}
          {mutation.isError && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">
              {(mutation.error as Error).message}
            </p>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={mutation.isPending}
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
