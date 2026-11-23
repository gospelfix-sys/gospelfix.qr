// QR 주소의 fragment(#b=은행&a=계좌&m=금액&h=예금주)를 읽는다.
// fragment는 서버로 전송되지 않아 서버·CDN 로그에 계좌번호가 남지 않는다. ?query로 바꾸지 말 것.

export interface Transfer {
  bankName: string;
  accountNumber: string;
  amount: number;
  accountHolder: string;
}

// 현실적인 상한(10억원). 1e21 같은 값이 화면·딥링크에 그대로 나가는 것을 막는다
const MAX_AMOUNT = 1_000_000_000;

// 제어 문자·방향 제어(bidi) 문자는 표시 위조에 쓰일 수 있어 통째로 거절한다
const UNSAFE_TEXT = /[\u0000-\u001F\u007F​-‏‪-‮⁦-⁩]/;

// 잘못되거나 변조 의심되는 입력은 null → 화면에서 "유효하지 않은 링크"로 처리한다
export function parseTransferHash(hash: string): Transfer | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const bankName = (params.get("b") ?? "").trim();
  const accountNumber = (params.get("a") ?? "").replace(/[^0-9]/g, "");
  const amount = Number(params.get("m"));
  const accountHolder = (params.get("h") ?? "").trim();

  if (!bankName || bankName.length > 20 || UNSAFE_TEXT.test(bankName)) return null;
  if (accountNumber.length < 6 || accountNumber.length > 20) return null;
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > MAX_AMOUNT) return null;
  if (accountHolder.length > 30 || UNSAFE_TEXT.test(accountHolder)) return null;

  return { bankName, accountNumber, amount, accountHolder };
}
