"use client";

import { useEffect, useState } from "react";
import { Button, buttonClassName } from "@/components/ui/Button";
import { FINANCE_APPS } from "@/lib/apps";
import { parseTransferHash, type Transfer } from "@/lib/parseTransfer";

type ViewState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "ready"; transfer: Transfer };

export default function TransferView() {
  const [view, setView] = useState<ViewState>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  // fragment는 브라우저에서만 읽을 수 있어 마운트 후 파싱한다
  useEffect(() => {
    const transfer = parseTransferHash(window.location.hash);
    setView(transfer ? { status: "ready", transfer } : { status: "invalid" });
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  if (view.status === "loading") return null;

  if (view.status === "invalid") {
    return (
      <p role="alert" className="py-16 text-center text-sm text-gray-500">
        유효하지 않은 링크예요. 가스펄픽스 입금 안내 화면에서 QR을 다시 만들어 주세요.
      </p>
    );
  }

  const { transfer } = view;

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(transfer.accountNumber);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-center text-lg font-bold">입금 안내</h1>

      <dl className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 text-[13px]">
        <div className="flex justify-between px-4 py-3">
          <dt className="text-gray-500">받는 은행</dt>
          <dd className="font-bold">{transfer.bankName}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <dt className="text-gray-500">계좌번호</dt>
          <dd className="font-mono font-bold">{transfer.accountNumber}</dd>
        </div>
        {transfer.accountHolder && (
          <div className="flex justify-between px-4 py-3">
            <dt className="text-gray-500">예금주</dt>
            <dd className="font-bold">{transfer.accountHolder}</dd>
          </div>
        )}
        <div className="flex justify-between px-4 py-3">
          <dt className="text-gray-500">입금 금액</dt>
          <dd className="font-bold">{transfer.amount.toLocaleString("ko-KR")}원</dd>
        </div>
      </dl>

      <Button onClick={copyAccountNumber}>{copied ? "복사됨" : "계좌번호 복사"}</Button>

      <section aria-label="금융앱 열기" className="space-y-2">
        <h2 className="text-[13px] font-semibold text-gray-700">금융앱으로 이동</h2>
        {FINANCE_APPS.map((app) => {
          const url = app.buildUrl(transfer);
          if (!url) return null;
          return (
            // 일반 <a>: 커스텀 스킴을 라우터가 가로채지 않게 한다
            <a
              key={app.id}
              href={url}
              className={buttonClassName("outline")}
            >
              {app.name}로 송금하기
            </a>
          );
        })}
        <p className="text-[11px] leading-relaxed text-gray-500">
          앱이 열리지 않으면 계좌번호를 복사해 사용 중인 금융앱에서 직접 송금해 주세요.
        </p>
      </section>

      <p className="text-[11px] leading-relaxed text-gray-500">
        금융앱 송금 화면을 여는 편의 기능이며 가스펄픽스는 해당 금융앱 회사와 제휴 관계가 아니에요.
        보내기 전 받는 은행·계좌번호·예금주·금액을 꼭 확인해주세요.
      </p>
    </div>
  );
}
