import type { ReactNode } from "react";

interface NoticeTextProps {
  children: ReactNode;
}

// /create 화면의 보조 안내 문구(기존 보조 문구 스타일 재사용)
export default function NoticeText({ children }: NoticeTextProps) {
  return <p className="text-[13px] text-muted-foreground">{children}</p>;
}
