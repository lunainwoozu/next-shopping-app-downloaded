import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/schemas/product.schema";

// 관리자 세션 확인 헬퍼
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

// ── PATCH: 상품 수정 (전체 or 재고만 부분 수정) ─────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  // .partial() → 모든 필드를 선택적으로 만들어 재고만 보내도 검증 통과
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(product);
}

// ── DELETE: 상품 삭제 ────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    // FK 제약 위반 (주문·장바구니에 상품이 포함된 경우)
    return NextResponse.json(
      { error: "주문 또는 장바구니 내역이 있어 삭제할 수 없습니다." },
      { status: 409 },
    );
  }
}
