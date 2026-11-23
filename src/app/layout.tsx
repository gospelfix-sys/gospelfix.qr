import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "송금 안내 | 가스펄픽스",
  // 계좌 정보가 담긴 주소이므로 검색엔진 색인을 막는다
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
