"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { productSchema, ProductInput } from "@/schemas/product.schema";

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
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
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
    <div className="modal-bd">
      <div className="modal">

        {/* 닫기 버튼 */}
        <button className="modal__close" onClick={handleClose} type="button">
          <X size={16} />
        </button>

        {/* 헤더 */}
        <div className="modal__head">
          <div>
            <div className="modal__num">{isEdit ? "EDIT PRODUCT" : "NEW PRODUCT"}</div>
            <h2 className="modal__title">{isEdit ? "상품 수정" : "상품 등록"}</h2>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>

          <div className="field">
            <label htmlFor="name">상품명</label>
            <input id="name" {...register("name")} placeholder="상품명을 입력하세요" />
            {errors.name && (
              <span className="text-xs text-destructive">{errors.name.message}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="description">상품 설명</label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="상품 설명을 입력하세요 (선택)"
              rows={3}
            />
          </div>

          <div className="modal__row">
            <div className="field">
              <label htmlFor="price">가격 (원)</label>
              <input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="10000"
                min={1}
              />
              {errors.price && (
                <span className="text-xs text-destructive">{errors.price.message}</span>
              )}
            </div>
            <div className="field">
              <label htmlFor="stock">재고</label>
              <input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="100"
                min={0}
              />
              {errors.stock && (
                <span className="text-xs text-destructive">{errors.stock.message}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="category">카테고리</label>
            <input
              id="category"
              {...register("category")}
              placeholder="예: 상의, 하의, 아우터"
            />
          </div>

          <div className="field">
            <label htmlFor="imageUrl">이미지 URL</label>
            <input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="/images/products/product1.jpg"
            />
          </div>

          {mutation.isError && (
            <p className="text-xs text-destructive mb-5">
              {(mutation.error as Error).message}
            </p>
          )}

          {/* 액션 버튼 */}
          <div className="modal__actions">
            {confirmDelete ? (
              <div className="delete-confirm flex-1">
                <em>정말 삭제할까요?</em>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="confirm"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "삭제 중..." : "확인"}
                </button>
              </div>
            ) : (
              <>
                {isEdit && onDelete && (
                  <button
                    type="button"
                    className="danger"
                    onClick={() => setConfirmDelete(true)}
                  >
                    삭제
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn--line"
                  disabled={mutation.isPending}
                  onClick={handleClose}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? isEdit ? "저장 중..." : "등록 중..."
                    : isEdit ? "저장하기" : "등록하기"}
                </button>
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
