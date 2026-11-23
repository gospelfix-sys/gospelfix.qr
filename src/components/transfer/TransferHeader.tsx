// 얇은 상단 헤더. 로고 이미지는 쓰지 않고 글자만 둔다
export default function TransferHeader() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4">
      <span className="text-[13px] font-semibold">가스펄픽스</span>
      <h1 className="text-[13px] font-normal text-muted-foreground">송금 안내</h1>
    </header>
  );
}
