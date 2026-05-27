import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "상품명은 2자 이상이어야 합니다"),
  description: z.string().optional(),
  price: z
    .number()
    .int("정수로 입력해주세요")
    .min(1, "가격은 1원 이상이어야 합니다"),
  stock: z
    .number()
    .int("정수로 입력해주세요")
    .min(0, "재고는 0개 이상이어야 합니다"),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
