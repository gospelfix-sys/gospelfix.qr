"use client";

import { useEffect, useState } from "react";
import AccountCard from "@/components/transfer/AccountCard";
import AmountHero from "@/components/transfer/AmountHero";
import AppGrid from "@/components/transfer/AppGrid";
import CopyBar from "@/components/transfer/CopyBar";
import GuideSteps from "@/components/transfer/GuideSteps";
import InvalidLink from "@/components/transfer/InvalidLink";
import TransferHeader from "@/components/transfer/TransferHeader";
import { useCopy } from "@/hooks/useCopy";
import { parseTransferHash, type Transfer } from "@/lib/parseTransfer";

type ViewState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "ready"; transfer: Transfer };

// 상태 분기와 조합만 맡는다
export default function TransferView() {
  const [view, setView] = useState<ViewState>({ status: "loading" });

  // fragment는 브라우저에서만 읽을 수 있어 마운트 후 파싱한다
  useEffect(() => {
    const transfer = parseTransferHash(window.location.hash);
    setView(transfer ? { status: "ready", transfer } : { status: "invalid" });
  }, []);

  // 로딩 중에는 빈 영역(짧은 깜빡임 방지)
  if (view.status === "loading") return null;

  if (view.status === "invalid") {
    return (
      <>
        <TransferHeader />
        <InvalidLink />
      </>
    );
  }

  return <ReadyView transfer={view.transfer} />;
}

interface ReadyViewProps {
  transfer: Transfer;
}

function ReadyView({ transfer }: ReadyViewProps) {
  const { copied, lastLabel, copy } = useCopy(transfer.accountNumber);

  return (
    <>
      <TransferHeader />
      <div className="flex-1 space-y-6 px-4 pb-6 pt-6">
        <AmountHero amount={transfer.amount} />
        <AccountCard
          bankName={transfer.bankName}
          accountNumber={transfer.accountNumber}
          accountHolder={transfer.accountHolder}
        />
        <AppGrid transfer={transfer} onCopy={(name) => void copy(name)} copiedAppName={lastLabel} />
        <GuideSteps />
      </div>
      <CopyBar copied={copied} onCopy={() => void copy()} />
    </>
  );
}
