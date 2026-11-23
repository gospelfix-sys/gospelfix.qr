"use client";

import { useState, type FormEvent } from "react";
import NoticeText from "@/components/create/NoticeText";
import QrPreview from "@/components/create/QrPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BANK_OPTIONS } from "@/lib/apps";
import { buildTransferUrl } from "@/lib/buildTransfer";
import { createQrMatrix } from "@/lib/qr";

type FieldName = "bank" | "account" | "holder";

interface Result {
  url: string;
  // null이면 입력이 너무 길어 QR을 만들 수 없다
  matrix: boolean[][] | null;
  // 만든 시점의 입력 요약(이후 입력이 바뀌면 이 결과는 지운다)
  bankLabel: string;
  accountNumber: string;
  accountHolder: string;
}

// 검증 규칙을 복제하지 않고, 필드를 하나씩 유효한 값으로 바꿔 보며 어느 입력이 문제인지 추정한다
function findInvalidField(bank: string, account: string, holder: string): FieldName {
  const origin = "https://example.invalid";
  if (holder.trim() && buildTransferUrl(origin, { bankName: bank, accountNumber: account })) {
    return "holder";
  }
  if (buildTransferUrl(origin, { bankName: bank, accountNumber: "123456789" })) return "account";
  return "bank";
}

const FIELD_ERROR_MESSAGE: Record<FieldName, string> = {
  bank: "은행을 다시 선택해 주세요.",
  account: "계좌번호를 다시 확인해 주세요.",
  holder: "예금주를 다시 확인해 주세요.",
};

// 입력값은 이 컴포넌트 상태에만 두고 저장하지 않는다. 입력이 바뀌면 이전 QR은 즉시 지운다
export default function CreateForm() {
  const [bank, setBank] = useState<string | null>(null);
  const [account, setAccount] = useState("");
  const [holder, setHolder] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [errorField, setErrorField] = useState<FieldName | null>(null);

  // 화면의 입력과 다른 QR이 남지 않도록 결과와 오류를 함께 비운다
  const clearResult = () => {
    setResult(null);
    setErrorField(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bank) {
      setResult(null);
      setErrorField("bank");
      return;
    }
    const url = buildTransferUrl(window.location.origin, {
      bankName: bank,
      accountNumber: account,
      accountHolder: holder,
    });
    if (!url) {
      setResult(null);
      setErrorField(findInvalidField(bank, account, holder));
      return;
    }
    setErrorField(null);
    setResult({
      url,
      matrix: createQrMatrix(url),
      bankLabel: BANK_OPTIONS.find((option) => option.value === bank)?.label ?? bank,
      accountNumber: account.replace(/[^0-9]/g, ""),
      accountHolder: holder.trim(),
    });
  };

  const errorFor = (field: FieldName) =>
    errorField === field ? (
      <p id={`${field}-error`} role="alert" className="text-[13px] font-semibold text-foreground">
        {FIELD_ERROR_MESSAGE[field]}
      </p>
    ) : null;

  return (
    <div className="flex-1 space-y-6 px-4 pb-8 pt-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="bank" className="block text-[13px] text-muted-foreground">
            받는 은행
          </label>
          <Select
            items={BANK_OPTIONS}
            value={bank}
            onValueChange={(value) => {
              setBank(value);
              clearResult();
            }}
          >
            <SelectTrigger
              id="bank"
              aria-invalid={errorField === "bank"}
              aria-describedby={errorField === "bank" ? "bank-error" : undefined}
            >
              <SelectValue placeholder="은행을 선택해 주세요" />
            </SelectTrigger>
            <SelectContent>
              {BANK_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errorFor("bank")}
        </div>

        <div className="space-y-2">
          <label htmlFor="account" className="block text-[13px] text-muted-foreground">
            계좌번호
          </label>
          <Input
            id="account"
            inputMode="numeric"
            autoComplete="off"
            placeholder="하이픈(-) 없이 입력해도 돼요"
            value={account}
            onChange={(event) => {
              setAccount(event.target.value);
              clearResult();
            }}
            aria-invalid={errorField === "account"}
            aria-describedby={errorField === "account" ? "account-error" : undefined}
          />
          {errorFor("account")}
        </div>

        <div className="space-y-2">
          <label htmlFor="holder" className="block text-[13px] text-muted-foreground">
            예금주 (선택)
          </label>
          <Input
            id="holder"
            autoComplete="off"
            value={holder}
            onChange={(event) => {
              setHolder(event.target.value);
              clearResult();
            }}
            aria-invalid={errorField === "holder"}
            aria-describedby={errorField === "holder" ? "holder-error" : undefined}
          />
          {errorFor("holder")}
        </div>

        <Button type="submit" size="lg" className="w-full">
          QR 만들기
        </Button>
      </form>

      {result &&
        (result.matrix ? (
          <QrPreview
            bankLabel={result.bankLabel}
            accountNumber={result.accountNumber}
            accountHolder={result.accountHolder}
            url={result.url}
            matrix={result.matrix}
          />
        ) : (
          <p role="alert" className="text-[13px] font-semibold text-foreground">
            입력 내용이 너무 길어요. 예금주를 줄여 다시 만들어 주세요.
          </p>
        ))}

      <NoticeText>
        QR을 스캔한 사람이 금융앱에서 금액을 직접 입력해요. 링크를 받은 사람은 누구나 이 계좌 정보를
        볼 수 있어요.
      </NoticeText>
    </div>
  );
}
