import { Card, CardContent } from "@/components/ui/card";

interface AccountCardProps {
  bankName: string;
  accountNumber: string;
  // 비어 있으면 행을 그리지 않는다
  accountHolder: string;
}

// 입금 정보 표. 행 구분은 divide-border, 카드 자체 여백은 행이 가지므로 0으로 둔다
export default function AccountCard({ bankName, accountNumber, accountHolder }: AccountCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="px-0">
        <dl className="divide-y divide-border">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <dt className="shrink-0 text-muted-foreground">받는 은행</dt>
            <dd className="text-right font-semibold">{bankName}</dd>
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <dt className="shrink-0 text-muted-foreground">계좌번호</dt>
            <dd className="break-all text-right font-mono font-semibold">{accountNumber}</dd>
          </div>
          {accountHolder && (
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <dt className="shrink-0 text-muted-foreground">예금주</dt>
              <dd className="text-right font-semibold">{accountHolder}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
