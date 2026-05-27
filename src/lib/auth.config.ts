import type { NextAuthConfig } from "next-auth";

/**
 * [auth.config.ts] Edge Runtime(미들웨어)과 Node.js 서버 양쪽에서 공유하는 "가벼운" 인증 공통 설정.
 * DB 접근이 없어 어디서든 실행 가능 → middleware.ts가 이 파일만 import해서 라우트를 보호한다.
 *
 * ⚠️ jwt / session 콜백을 여기에 정의해야 미들웨어(Edge Runtime)에서도
 *    token.role → auth.user.role 매핑이 적용된다.
 */
const protectedRoutes = ["/mypage"];
const adminRoutes = ["/admin"];

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    // ─── JWT 콜백: 로그인 시 user.role을 토큰에 저장 ───────────────────────
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },

    // ─── Session 콜백: 토큰의 role을 세션에 노출 ──────────────────────────
    // 미들웨어가 authConfig만 사용하므로, 이 콜백이 여기 없으면
    // authorized()에서 auth.user.role이 항상 undefined가 됨
    session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },

    // ─── authorized 콜백: 라우트 접근 권한 검사 ───────────────────────────
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;
      const pathname = nextUrl.pathname;

      // 1. 관리자 경로 접근 시도
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== "admin")
          return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      // 2. 일반 보호 경로 접근 시도
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isProtectedRoute && !isLoggedIn) return false;

      // 3. 그 외 경로는 통과
      return true;
    },
  },
  providers: [],
};
