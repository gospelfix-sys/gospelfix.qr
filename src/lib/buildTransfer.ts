import { parseTransferHash } from "@/lib/parseTransfer";

export interface TransferInput {
  bankName: string;
  accountNumber: string;
  accountHolder?: string;
  amount?: number | null;
}

// 검증 규칙을 여기서 복제하지 않는다. 직렬화한 결과를 parseTransferHash로 왕복 검증해
// 통과할 때만 돌려주면, 받는 쪽이 거절할 링크를 QR로 만들어 내보낼 일이 없다.
// 계좌정보는 fragment로만 담는다(서버·로그로 전송되지 않음). ?query로 바꾸지 말 것
export function buildTransferHash(input: TransferInput): string | null {
  const params = new URLSearchParams();
  params.set("b", input.bankName.trim());
  // parse와 같은 정규화(숫자만 남김)를 적용해 하이픈·공백 입력을 허용한다
  params.set("a", input.accountNumber.replace(/[^0-9]/g, ""));
  const holder = (input.accountHolder ?? "").trim();
  if (holder) params.set("h", holder);
  if (input.amount !== undefined && input.amount !== null) params.set("m", String(input.amount));

  const hash = `#${params.toString()}`;
  return parseTransferHash(hash) ? hash : null;
}

// origin은 호출부(브라우저의 location.origin 등)에서 받는다. window에 의존하지 않기 위함
export function buildTransferUrl(origin: string, input: TransferInput): string | null {
  const hash = buildTransferHash(input);
  if (!hash) return null;
  return `${origin.replace(/\/+$/, "")}/pay${hash}`;
}
