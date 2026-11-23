import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "송금 안내 | 가스펄픽스",
  // 계좌 정보가 담긴 주소이므로 검색엔진 색인을 막는다
  robots: { index: false, follow: false },
};

// 확대는 막지 않는다(접근성). 주소창 색은 배경과 맞춘다
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
