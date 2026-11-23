import type { Transfer } from "@/lib/parseTransfer";

// 금융앱 버튼 목록(LAUNCH_APPS). 사전입력 딥링크는 확인된 앱(토스)만 쓰고(비공식 스펙이라 앱 업데이트로 깨질 수 있다),
// 나머지는 계좌를 싣지 않고 앱만 연다. 어느 쪽이든 화면의 "계좌번호 복사"가 항상 대안이 된다.

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

export interface LaunchApp {
  id: string;
  name: string;
  // 은행·계좌·금액까지 미리 채워지는지. false면 앱만 열리고 계좌는 복사해 붙여넣어야 한다
  prefilled: boolean;
  // 열 수 없는 경우(은행 미인식 등) null
  buildUrl: (transfer: Transfer) => string | null;
}

// 문자열이면 앱만 여는 상수 스킴(계좌 미입력), 함수면 transfer로 URL을 만드는 사전입력 딥링크다
function launchApp(
  id: string,
  name: string,
  url: string | ((transfer: Transfer) => string | null),
): LaunchApp {
  return typeof url === "string"
    ? { id, name, prefilled: false, buildUrl: () => url }
    : { id, name, prefilled: true, buildUrl: url };
}

function buildTossUrl({ bankName, accountNumber, amount }: Transfer): string | null {
  const bank = normalizeTossBankName(bankName);
  if (!bank) return null;
  const params = new URLSearchParams({ bank, accountNo: accountNumber });
  // 금액 없는 링크는 amount를 생략해 보내는 사람이 토스에서 직접 입력하게 한다
  if (amount !== null) params.set("amount", String(amount));
  return `supertoss://send?${params.toString()}`;
}

// 앱 실행 스킴 출처는 공개 스킴 목록(비공식 단일 출처, KB만 토스페이먼츠 가이드와 교차 확인)이다.
// 공식 문서가 아니라서 실기기에서 열리는지 확인하기 전에는 값이 바뀔 수 있다(토스 제외).
// 앱이 없거나 스킴이 틀리면 열리지 않으므로 화면 안내(복사 후 직접 열기)가 항상 폴백이다.
// 타일은 이 배열 순서대로 그린다.
export const LAUNCH_APPS: readonly LaunchApp[] = [
  launchApp("toss", "토스", buildTossUrl),
  launchApp("kb", "국민", "kbbank://"),
  launchApp("nh", "농협", "newnhsmartbanking://"),
  launchApp("kakaobank", "카카오", "kakaobank://"),
  launchApp("shinhan", "신한", "smailapp://"),
  launchApp("woori", "우리", "wooribank://"),
  launchApp("hana", "하나", "hanapush://"),
  launchApp("kbank", "케뱅", "ukbanksmartbank://"),
];
