interface TransferHeaderProps {
  // 우측 화면 이름. 송금 화면과 QR 만들기 화면이 같은 헤더를 쓴다
  title?: string;
}

// 얇은 상단 헤더. 로고 이미지는 쓰지 않고 글자만 둔다
export default function TransferHeader({ title = "송금 안내" }: TransferHeaderProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4">
      <span className="text-[13px] font-semibold">가스펄픽스</span>
      <h1 className="text-[13px] font-normal text-muted-foreground">{title}</h1>
    </header>
  );
}
