# @gospelfix/qr

가스펄픽스 입금 안내용 송금 링크 로직과 React 화면입니다. 계좌정보(은행·계좌번호·예금주, 선택으로 금액)를 URL fragment로만 주고받는 QR 송금 안내를 여러 프로젝트에서 쓰도록 분리한 패키지입니다.

> 0.x 단계라 마이너 버전에서 호환이 깨질 수 있습니다. 가스펄픽스 서비스 전용이며 금융기관·금융앱과 제휴 관계가 없습니다.

## 설치

```bash
yarn add @gospelfix/qr
# React UI(@gospelfix/qr/react)를 쓰면 react, react-dom ^18 이 필요합니다
```

진입점은 둘입니다.

| import | 내용 | React 필요 |
|---|---|---|
| `@gospelfix/qr` | 파싱·검증, 링크 빌더, 앱 목록, QR 행렬 | 아니오 |
| `@gospelfix/qr/react` | `TransferView`, `CreateForm` | 예(^18) |

ESM과 CJS를 모두 제공하고 타입(`.d.ts`)이 포함됩니다.

## 링크 형식

```
https://<도메인>/pay#b=<은행>&a=<계좌번호>&m=<금액>&h=<예금주>
```

- 값은 모두 `#` 뒤(fragment)에 둡니다. fragment는 서버로 전송되지 않아 서버·CDN 로그에 계좌 정보가 남지 않습니다. `?query`로 바꾸지 마세요.
- `m`(금액)은 선택입니다. 없거나 비어 있으면 유효(`amount: null`), 값이 있는데 잘못되면 링크 전체가 무효입니다.
- 잘못된 값(누락·범위 초과·제어 문자)은 `null`로 거절됩니다.

## 사용 예

### 로직

```ts
import {
  parseTransferHash,
  buildTransferUrl,
  createQrMatrix,
  LAUNCH_APPS,
  BANK_OPTIONS,
} from "@gospelfix/qr";

// 받는 쪽: fragment 검증
const transfer = parseTransferHash(window.location.hash); // Transfer | null
if (transfer) {
  for (const app of LAUNCH_APPS) {
    const url = app.buildUrl(transfer); // string | null (열 수 없으면 null)
  }
}

// 만드는 쪽: 받는 쪽이 거절할 링크는 만들지 않는다(null)
const url = buildTransferUrl("https://example.com", {
  bankName: "토스뱅크",
  accountNumber: "000-0000-0000",
  accountHolder: "홍길동",
});
const matrix = url ? createQrMatrix(url) : null; // boolean[][] | null (용량 초과 시 null)
```

### React UI

```tsx
import { TransferView, CreateForm } from "@gospelfix/qr/react";

// 송금 화면(/pay): 마운트 후 window.location.hash 를 읽어 렌더링
export default function PayPage() {
  return <TransferView />;
}

// QR 만들기 화면
export default function Home() {
  return <CreateForm />;
}
```

`/react` 진입점은 `"use client"` 로 시작하므로 Next.js App Router에서 서버 컴포넌트가 직접 import해도 됩니다. 컴포넌트는 `window.location` 을 마운트 후에만 읽습니다.

## API

| 이름 | 설명 |
|---|---|
| `parseTransferHash(hash: string): Transfer \| null` | 모든 입력 검증의 단일 관문. 화면과 딥링크에는 이 함수를 통과한 값만 쓴다 |
| `Transfer` | `{ bankName; accountNumber; amount: number \| null; accountHolder }` |
| `buildTransferHash(input): string \| null` | `#b=&a=&h=[&m=]` 직렬화. `parseTransferHash` 왕복 검증을 통과할 때만 반환 |
| `buildTransferUrl(origin, input): string \| null` | `${origin}/pay${hash}` |
| `TransferInput` | `{ bankName; accountNumber; accountHolder?; amount? }` |
| `LAUNCH_APPS: readonly LaunchApp[]` | 금융앱 목록(토스·국민·농협·카카오·신한·우리·하나·케뱅) |
| `LaunchApp` | `{ id; name; prefilled; buildUrl(transfer) => string \| null }` |
| `BANK_OPTIONS: readonly BankOption[]` | 은행 선택 목록 `{ value; label }` |
| `createQrMatrix(text): boolean[][] \| null` | QR 모듈 행렬(렌더링은 소비자가 한다) |
| `TransferView`, `CreateForm` | `@gospelfix/qr/react`. props 없는 화면 단위 컴포넌트 |

참고: 송금 화면까지 사전 입력되는 앱은 토스뿐입니다(`prefilled: true`, 비공식 스펙). 나머지 앱은 앱만 열며 계좌번호는 복사해 붙여넣어야 합니다. 앱 실행 스킴은 실기기 확인 전이라 바뀔 수 있습니다.

## 스타일 설정 (React UI를 쓸 때 필수)

UI 스타일은 미리 빌드된 CSS로 제공됩니다. 앱의 진입 파일(예: Next.js `app/layout.tsx`) 한 곳에서 import하세요. 소비 프로젝트의 Tailwind 설정(`content`)이나 CSS 변수 정의는 필요 없습니다.

```tsx
import "@gospelfix/qr/styles.css";
```

- 이 CSS에는 컴포넌트가 쓰는 유틸리티 클래스, shadcn 색 토큰 변수(`:root` 의 `--background`, `--card`, `--primary` 등과 `--radius`), Tailwind 기본 리셋(preflight)이 들어 있습니다.
- 소비 프로젝트에 이미 shadcn 변수(`--primary` 등)가 있으면 CSS를 import하는 순서에 따라 값이 서로 덮어쓰입니다. 패키지 화면의 색을 유지하려면 이 CSS를 나중에 import하고, 프로젝트의 기존 테마를 유지하려면 먼저 import하세요.
- 포함된 리셋은 `*`, `html`, `body`, `button`, `p` 등 전역 요소에 적용됩니다. 리셋 없는 프로젝트에서는 기존 페이지의 기본 여백·테두리가 달라질 수 있으므로. 번들러에 따라 import한 CSS는 앱 전체에 적용될 수 있으니 적용 후 기존 화면을 확인하세요.
- 번들러가 CSS import를 지원해야 합니다(Next.js, Vite 등).

## 원칙 (소비자에게도 적용됩니다)

- 계좌정보는 URL fragment로만 받습니다. 서버로 보내거나 `?query`, 저장소(localStorage 등)에 두지 마세요.
- 패키지는 외부 요청·분석·콘솔 로그를 하지 않습니다.
- 금융앱 로고는 쓰지 않습니다. "결제"가 아니라 "송금"이라고 표기합니다.
- 화면에는 편의 기능이며 제휴 관계가 아니라는 안내와 보내기 전 확인 안내가 항상 노출됩니다. 이 문구를 제거하거나 바꾸지 마세요.

## 버전 규칙

semver를 따르되 0.x 동안에는 마이너(0.y.0)에서 호환되지 않는 변경이 있을 수 있고, 패치(0.0.z)는 버그 수정만 담습니다. 1.0.0 이후에는 공개 API 변경은 메이저, 기능 추가는 마이너, 수정은 패치입니다.

## 개발

```bash
yarn install --frozen-lockfile   # npm 금지, Node 24.x
yarn dev          # http://localhost:3000 (데모 앱)
yarn build        # out/ 생성 (정적 사이트)
yarn build:lib    # dist/ 생성 (JS는 tsup, dist/styles.css는 Tailwind CLI)
npx tsc --noEmit
yarn lint
```

자세한 설계와 규칙은 `CLAUDE.md` 와 `docs/` 를 참고하세요(패키지에는 포함되지 않습니다).

## 라이선스

MIT
