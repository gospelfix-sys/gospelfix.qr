import type { Transfer } from "@/lib/parseTransfer";

// 금융앱 버튼 목록. 사전입력 딥링크는 확인된 앱만 넣는다(비공식 스펙이라 앱 업데이트로 깨질 수 있다).
// 미확인 앱은 넣지 않고 화면의 "계좌번호 복사"가 항상 대안이 되게 한다.

// 입력된 은행명 → 토스가 인식하는 짧은 은행명
const TOSS_BANK_ALIASES: Record<string, string> = {
  국민: "국민",
  KB국민: "국민",
  KB: "국민",
  신한: "신한",
  우리: "우리",
  하나: "하나",
  KEB하나: "하나",
  농협: "농협",
  NH농협: "농협",
  NH: "농협",
  기업: "기업",
  IBK기업: "기업",
  IBK: "기업",
  SC제일: "SC제일",
  제일: "SC제일",
  씨티: "씨티",
  한국씨티: "씨티",
  카카오뱅크: "카카오뱅크",
  카카오: "카카오뱅크",
  케이뱅크: "케이뱅크",
  토스뱅크: "토스뱅크",
  우체국: "우체국",
  새마을금고: "새마을",
  새마을: "새마을",
  신협: "신협",
  수협: "수협",
  산업: "산업",
  KDB산업: "산업",
  부산: "부산",
  대구: "대구",
  광주: "광주",
  전북: "전북",
  경남: "경남",
  제주: "제주",
};

function normalizeTossBankName(bankName: string): string | null {
  const compact = bankName.replace(/\s+/g, "");
  // "토스뱅크"처럼 이름 자체가 별칭 표에 있는 경우를 먼저 본다
  return (
    TOSS_BANK_ALIASES[compact] ?? TOSS_BANK_ALIASES[compact.replace(/(주식회사|은행)$/, "")] ?? null
  );
}

export interface BankOption {
  // QR의 b= 에 들어가는 토스 정규 은행명(딥링크가 끊기지 않는 값)
  value: string;
  label: string;
}

// 흔한 은행을 앞쪽에 둔다. 여기에 없는 정규명은 별칭 표 순서대로 뒤에 붙는다
const BANK_ORDER = [
  "국민",
  "신한",
  "우리",
  "하나",
  "농협",
  "기업",
  "카카오뱅크",
  "케이뱅크",
  "토스뱅크",
];

// 은행이 아닌 기관은 "~은행"을 붙이면 어색해서 표시명을 따로 둔다
const BANK_LABEL_OVERRIDES: Record<string, string> = {
  우체국: "우체국",
  새마을: "새마을금고",
  신협: "신협",
  수협: "수협은행",
  카카오뱅크: "카카오뱅크",
  케이뱅크: "케이뱅크",
  토스뱅크: "토스뱅크",
  SC제일: "SC제일은행",
};

// 별칭 표의 값에서 파생해 목록과 별칭 표가 어긋나지 않게 한다(중복 하드코딩 금지)
const canonicalBanks = Array.from(new Set(Object.values(TOSS_BANK_ALIASES)));
const rank = (v: string) => {
  const i = BANK_ORDER.indexOf(v);
  return i === -1 ? BANK_ORDER.length : i;
};

export const BANK_OPTIONS: readonly BankOption[] = canonicalBanks
  .map((value, index) => ({ value, index }))
  .sort((a, b) => rank(a.value) - rank(b.value) || a.index - b.index)
  .map(({ value }) => ({ value, label: BANK_LABEL_OVERRIDES[value] ?? `${value}은행` }));

export interface FinanceApp {
  id: string;
  name: string;
  // 은행·계좌·금액까지 미리 채워지는지. false면 앱만 열리고 계좌는 복사해 붙여넣어야 한다
  prefilled: boolean;
  // 열 수 없는 경우(은행 미인식 등) null
  buildUrl: (transfer: Transfer) => string | null;
}

export const FINANCE_APPS: FinanceApp[] = [
  {
    id: "toss",
    name: "토스",
    prefilled: true,
    buildUrl: ({ bankName, accountNumber, amount }) => {
      const bank = normalizeTossBankName(bankName);
      if (!bank) return null;
      const params = new URLSearchParams({ bank, accountNo: accountNumber });
      // 금액 없는 링크는 amount를 생략해 보내는 사람이 토스에서 직접 입력하게 한다
      if (amount !== null) params.set("amount", String(amount));
      return `supertoss://send?${params.toString()}`;
    },
  },
];

export interface CopyGuideApp {
  id: string;
  name: string;
}

// 스킴이 확인되지 않은 앱이라 앱을 열지 않고 "계좌번호 복사"만 안내한다.
// 그래서 buildUrl 같은 URL 필드를 두지 않는다(미확인 스킴 추가 금지).
export const COPY_GUIDE_APPS: readonly CopyGuideApp[] = [
  { id: "kb", name: "국민" },
  { id: "nh", name: "농협" },
  { id: "kakaobank", name: "카카오" },
  { id: "shinhan", name: "신한" },
  { id: "woori", name: "우리" },
  { id: "hana", name: "하나" },
  { id: "kbank", name: "케뱅" },
];
