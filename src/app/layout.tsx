import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { QueryProvider } from "@/providers/QueryProvider"; // ← 추가
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ShopApp",
  description: "쇼핑몰 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          {" "}
          {/* ← 추가 */}
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
          <Footer />
        </QueryProvider>{" "}
        {/* ← 추가 */}
      </body>
    </html>
  );
}
