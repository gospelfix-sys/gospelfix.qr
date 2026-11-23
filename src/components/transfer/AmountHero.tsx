interface AmountHeroProps {
  amount: number;
}

// 가장 먼저 확인해야 하는 금액을 화면에서 가장 크게 보여준다
export default function AmountHero({ amount }: AmountHeroProps) {
  return (
    <section aria-label="보낼 금액" className="space-y-1">
      <p className="text-[13px] text-muted-foreground">보낼 금액</p>
      <p className="text-2xl font-semibold">{amount.toLocaleString("ko-KR")}원</p>
    </section>
  );
}
