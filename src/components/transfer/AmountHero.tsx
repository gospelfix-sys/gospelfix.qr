interface AmountHeroProps {
  // 금액 없는 QR(만든 사람이 금액을 정하지 않은 경우)은 null
  amount: number | null;
}

// 가장 먼저 확인해야 하는 금액을 화면에서 가장 크게 보여준다. 금액이 없으면 영역 자체를 그리지 않는다
export default function AmountHero({ amount }: AmountHeroProps) {
  if (amount === null) return null;

  return (
    <section aria-label="보낼 금액" className="space-y-1">
      <p className="text-[13px] text-muted-foreground">보낼 금액</p>
      <p className="text-2xl font-semibold">{amount.toLocaleString("ko-KR")}원</p>
    </section>
  );
}
