# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

가스펄픽스 입금 안내 중간 페이지. QR을 스캔하면 금융앱 버튼 목록을 보여주고, 누른 앱의 송금 화면으로 이동시킨다. `/`(첫 화면)에서는 은행·계좌번호·예금주만 입력해 송금 화면(`/pay`)으로 연결되는 QR을 만들 수 있다(금액 없음).
코드 컨벤션은 사용자 앱(`gospelfix` 저장소의 `CLAUDE.md`)을 따르되, 이 저장소는 정적 사이트라 BFF·Recoil은 쓰지 않는다.

## 명령어

```bash
yarn dev          # http://localhost:3000
yarn build        # out/ 생성 (output: "export")
yarn lint         # next lint
yarn build:lib    # 라이브러리(dist/) 빌드, prepack이 자동 실행
npx tsc --noEmit  # 타입 체크
```

패키지 매니저는 yarn, 설치는 `yarn install --frozen-lockfile`(npm 금지, Node 24.x). 테스트 스위트는 없다. 검증은 `tsc --noEmit` → `yarn lint` → `yarn build` 순서로 한다. 순수 함수(`parseTransferHash` 등)는 저장소 밖 스크래치 스크립트로 정상/경계/변조 입력을 확인한다(가짜 계좌번호만 사용, 커밋 금지).
`yarn pretty`는 src 전체를 포맷하므로 문구 몇 줄 수정에는 쓰지 않는다(Prettier: 쌍따옴표·세미콜론·100자·trailing comma all).

## 아키텍처

서버·DB·API·환경변수가 없는 정적 사이트다. 계좌정보는 **URL fragment로만** 흐른다.

```
gospelfix 앱 팝업(QR) 또는 /(QR 만들기) ──>  https://<pay>/pay#b=&a=&h=[&m=]
                              │ (fragment는 서버로 전송되지 않음)
              app/pay/page.tsx ─> TransferView(클라이언트)
                                  ├─ lib/parseTransfer.ts  hash 문자열 파싱·검증(`parseTransferHash`, hash는 TransferView가 읽음) (실패 시 "유효하지 않은 링크")
                                  └─ lib/apps.ts           LAUNCH_APPS[].buildUrl(transfer) → 앱 딥링크

/ (QR 만들기, 브라우저에서만 생성, 서버·저장 없음)
  CreateForm ─ lib/buildTransfer.ts(hash 직렬화 → parseTransferHash 왕복 검증) ─ lib/qr.ts(모듈 행렬) ─> QrPreview(<svg>)
```

- `lib/parseTransfer.ts`: 모든 입력 검증의 단일 관문. 화면과 딥링크에는 `parseTransferHash`를 통과한 값만 쓴다(금액 상한·`isSafeInteger`, 제어·bidi 문자 거절, 예금주·은행명 길이, 계좌 숫자 6~20자). **`m`(금액)은 선택값**이다: 없거나 빈 값이면 유효(`Transfer.amount === null`), 값이 있으면 엄격 검증하고 잘못되면 링크 전체가 무효다.
- `lib/apps.ts`: `LAUNCH_APPS: readonly LaunchApp[]` 단일 목록(`LaunchApp { id, name, prefilled, buildUrl(transfer) → string | null }`, 순서: 토스·국민·농협·카카오·신한·우리·하나·케뱅). 헬퍼 `launchApp(id, name, url)`은 url이 문자열이면 앱만 여는 상수 스킴(`prefilled: false`), 함수면 사전입력 딥링크(`prefilled: true`)로 만든다. 송금 화면까지 사전입력하는 앱은 토스(`supertoss://send?bank=&accountNo=&amount=`, 비공식 스펙, 금액이 없으면 `amount` 생략)뿐이며, 은행명 별칭 정규화(`normalizeTossBankName`)에 실패하면 `buildUrl`은 `null`을 돌려준다. 그 밖의 자주 쓰는 앱 7개(국민·농협·카카오·신한·우리·하나·케뱅)는 상수 스킴으로 **앱만 연다**(계좌번호·금액을 스킴에 싣지 않고 `prefilled: false`). 이 스킴은 공개 스킴 목록(비공식 단일 출처, KB만 토스페이먼츠 가이드와 교차 확인)에서 가져왔고 **실기기에서 열리는지 아직 확인되지 않았다**(신한 `smailapp://`은 슈퍼SOL, 농협 `newnhsmartbanking://`은 NH스마트뱅킹을 고른 것이라 확인 뒤 바뀔 수 있다). 열리지 않을 때의 폴백은 화면의 복사 안내다. `BANK_OPTIONS`(`{value,label}[]`)는 은행명 별칭 표에서 파생한 `/`(QR 만들기)의 은행 선택 목록이다(`value`는 토스 정규 은행명).
- `lib/buildTransfer.ts`: `buildTransferHash`/`buildTransferUrl`. 검증 규칙을 복제하지 않고 직렬화한 결과를 `parseTransferHash`로 왕복 검증해 통과할 때만 돌려준다(받는 쪽이 거절할 QR을 만들지 않는 단일 관문 유지). `lib/qr.ts`의 `createQrMatrix`는 `qrcode-generator`로 `boolean[][]`만 돌려주며(용량 초과 시 `null`) 화면은 이를 `<svg><path>`로 직접 그린다(`dangerouslySetInnerHTML` 미사용).
- `components/TransferView.tsx`: 상태 분기(로딩/유효하지 않음/정상)와 조합만 맡는다. 화면 구성은 `components/transfer/`에 나뉘어 있다: `TransferHeader`(얇은 헤더), `AmountHero`(금액 24px/600, 금액이 없으면 그리지 않음), `AccountCard`(입금 정보 표), `AppGrid`(금융앱 타일 4열, 글자만), `GuideSteps`(3단계·고지), `CopyBar`(하단 고정 바의 주 버튼), `InvalidLink`.
- `components/create/`(`/` QR 만들기 화면, `app/page.tsx`가 헤더+`CreateForm`을 조합): `CreateForm`(은행 Select·계좌번호·예금주 Input, 입력값은 상태에만 두고 저장하지 않으며 입력이 바뀌면 이전 QR을 지운다), `QrPreview`(입력 요약 카드 → 흰 바탕 고정 QR → PNG 저장·링크 복사). 링크 복사는 `useCopy`를 재사용한다. 입력값·생성 결과를 서버로 보내지 않는다. `buildTransferUrl`은 `${origin}/pay${hash}`를 돌려준다.
- 옛 링크 호환: 이전에 발급된 QR은 `/#b=&a=&h=` 형식이다. `components/create/LegacyLinkRedirect`(클라이언트)가 `/`에서 `window.location.hash`가 있으면 `window.location.replace('/pay' + hash)`로 보낸다(fragment는 서버로 전송되지 않는 원칙 그대로). `gospelfix` 앱의 QR이 아직 `/#...`를 가리키므로 호환 리다이렉트로 동작하며, 앱 쪽을 `/pay#...`로 고치는 것은 후속 작업이다.
- `AppGrid`: `LAUNCH_APPS` 단일 목록을 그린다. `buildUrl(transfer)`가 있으면 `<a href>` 타일이고, `prefilled`가 false인 앱(토스 외)만 `onClick`으로 계좌번호를 복사하므로 누르면 복사한 뒤 앱이 열리고(송금 화면까지는 가지 않는다), 사용자는 앱에서 붙여넣기만 하면 된다. 복사 안내 문구는 그대로 노출된다. 결과가 `null`(토스에서 은행 미인식)이면 숨기지 않고 복사 `<Button aria-pressed>` 타일로 대체하며, `aria-pressed` 선택 표시는 이 폴백 타일에만 있다. 타일 문구는 앱 이름만이다.
- `hooks/useCopy.ts`: 클립보드 복사와 "복사됐어요" 상태의 **단일 출처**. 복사하는 곳은 `navigator.clipboard`를 직접 부르지 않고 이 훅을 쓴다(`"use client"`).
- `components/ui/button.tsx`·`card.tsx`·`input.tsx`·`select.tsx`: shadcn(base-nova)을 Tailwind 3.4·이 프로젝트 디자인 규칙에 맞게 정리한 것. `size="default"`(h-12, 13px/400)는 앱 타일용, `size="lg"`(h-12, 16px/600)는 주 버튼용이다. 어긋난 곳 목록은 `docs/README.md`.
- 링크 서명(ECDSA 위조 방지)은 미구현이다. 구현하면 서명 발급은 `gospelfix` 앱 서버, 이 저장소는 공개키 검증만 맡는다.

## 원칙

- **모든 UX/UI는 shadcn/ui 컴포넌트(base-nova)를 기반으로 만든다.** 설정은 루트 `components.json`, 추가는 `npx shadcn@latest add <이름>`, `asChild` 금지(링크 버튼은 `<a className={buttonVariants({variant})}>`). 값·규칙은 `docs/DESIGN.md`(→ `docs/07-components.md`, `docs/09-shadcn-tokens.md`)를 따른다. 색은 CSS 변수 클래스(`bg-card`, `border-border` 등)만 쓴다. 팔레트는 가스펄픽스 브랜드 사이트와 통일한 베이지 중립색 + 주황 포인트(`--primary` #FF5500, 주 버튼에만, 글자는 검정)이고 `--radius`는 1rem이다(`docs/02-colors.md`, `docs/05-radius.md`).
- **계좌정보는 URL fragment(`#b=&a=&h=`, `m`은 선택)로만 받는다.** `?query`로 바꾸지 않는다.
- 백엔드가 필요해지면 `gospelfix.cms.api`에서 시작하고, 이 앱은 직접 호출하지 않는다.
- `noindex`. 분석 스크립트·외부 요청·콘솔 로그·외부 폰트 금지.
- 가스펄픽스 서비스 전용. 금융앱 로고는 쓰지 않고, "결제"가 아니라 "송금"이라고 표기한다. 면책 단정 문구는 쓰지 않는다.
- 화면에는 편의 기능·제휴 아님·보내기 전 확인 안내를 항상 노출한다. QR 만들기 화면(`/`)은 확정된 두 안내 문구(A: 하단 상시, B: QR 생성 후)를 노출한다(문구는 `docs/07-components.md`).
- 오류 표시는 빨간색이 아니라 검정이다: 오류 문구 `font-semibold` + `role="alert"`, 오류 필드 `aria-invalid` 시 `border-foreground`(검정) 2px. `--primary`는 주황이라 오류·선택에 쓰지 않는다. `--destructive`는 화면에 쓰지 않는다.
- 새 앱 실행 스킴은 공개 목록 출처 + 실기기 확인이 필요하다(현재 `LAUNCH_APPS` 7개는 사용자 승인은 받았으나 실기기 확인 전). 열리지 않을 때 폴백은 화면의 복사 안내다.
- 커스텀 스킴(`supertoss://` 등)은 `next/link`가 아닌 일반 `<a>`로 연다.
- shadcn 관련 패키지(`@base-ui/react`, `class-variance-authority`, `lucide-react`)와 `lib/utils.ts`(`cn`), `globals.css`의 CSS 변수, shadcn 컴포넌트 `button`·`card`·`input`·`select`, QR 의존성 `qrcode-generator`는 이미 들어와 있다. 새 shadcn 컴포넌트·의존성 추가는 사용자 승인 후에 한다.

## 라이브러리화 계획

`@gospelfix/qr`(MIT)로 npm에 배포할 패키징 준비가 끝났다(범위: 로직 + React UI). 아직 배포하지 않았고 `package.json`은 배포 직전까지 `private: true`로 둔다(제거는 사용자 확인 후). `engines`는 `node 24.x` 그대로다.

- 진입점 2개: `@gospelfix/qr`(`src/index.ts`, 로직만: `parseTransferHash`·`Transfer`·`LAUNCH_APPS`·`LaunchApp`·`BANK_OPTIONS`·`BankOption`·`buildTransferHash`·`buildTransferUrl`·`TransferInput`·`createQrMatrix`)와 `@gospelfix/qr/react`(`src/react.ts`, `TransferView`·`CreateForm`, 빌드 후 `"use client"` 부착). tsup(ESM `.mjs` + CJS `.js` + d.ts)으로 `yarn build:lib`을 실행하고 `prepack`이 이를 자동 실행한다. 출력 `dist/`는 gitignore 대상이다. `package.json`에 `"type"` 필드를 두지 않은 것은 Next 앱의 설정 파일 해석이 바뀔 수 있어서다.
- `next`·`react`·`react-dom`은 devDependencies, `react`·`react-dom` ^18은 peerDependencies다.
- 스타일: 미리 빌드한 CSS(방식 B) `@gospelfix/qr/styles.css`를 제공한다. 소비자는 `import "@gospelfix/qr/styles.css"` 한 줄이면 되고 Tailwind 설정은 필요 없다. 입력은 `src/styles/lib.css`(`@import "../app/globals.css"`, 앱과 같은 CSS 변수 소스), 설정은 `tailwind.lib.config.ts`(앱 `tailwind.config.ts`의 theme 재사용, content는 `src/components/**`·`src/hooks/**`만), 스크립트는 `build:css`(출력 `dist/styles.css`, minify, 약 12.7 KB)이며 `build:lib`은 `tsup && yarn build:css`다. `package.json`의 `exports`에 `./styles.css`가 있고 `sideEffects`는 `["**/*.css"]`다(CSS import가 tree-shaking으로 사라지지 않게). 컴포넌트가 의존하므로 preflight(Tailwind 전역 리셋)를 포함한다. 알려진 한계(0.1.0): `:root`에 shadcn 표준 변수 이름(`--primary` 등)을 정의하고 preflight가 전역에 적용되므로, 소비자가 shadcn을 쓰면 import 순서에 따라 서로 덮어쓸 수 있다. body 배경은 CSS에 없다. 대안은 `[data-gospelfix-qr]` 스코프 + 변수 접두어이며 아직 적용하지 않았다(0.2.0에서 소비자 충돌 사례가 나오면 전환 검토, 0.x 동안 호환 파괴 허용).
- 검증 완료: `build:lib`, `npm pack --dry-run`(dist·README·LICENSE만), 저장소 밖 설치 테스트(ESM·CJS·`/react`·타입).
- 남은 일: 배포 직전 작업(`npm login`, `@gospelfix` 조직 생성, `private: true` 제거, 루트 README의 "아직 npm에 배포되지 않았습니다" 문구 제거, `npm publish --access public`)은 사용자만 실행한다. `TransferView`의 `hash` prop 추가, `buildTransferUrl`의 path 옵션은 후속 검토 항목이다.

`src/lib/**`는 react·next·window에 의존하지 않는 순수 TS로 유지하고, 컴포넌트는 `next/*` 없이 props만으로 동작하게 쓴다. `npm publish`·`npm login`은 사용자만 실행한다.

## 서브에이전트 (오케스트레이션)

메인 세션이 오케스트레이터가 되어 전문 서브에이전트(`.claude/agents/`)에게 위임하고 결과를 취합한다. 역할·파일 소유권·병렬/순차 기준·승인이 필요한 일은 `.claude/rules/orchestration.md`를 따른다.

| 에이전트 | 맡는 일 |
|---|---|
| `transfer-logic` | 송금 로직 (`src/lib/**`: 파싱·검증·딥링크) |
| `ui-writer` | shadcn 기반 UI (`src/components/**`, `globals.css`) |
| `package-builder` | `@gospelfix/qr` npm 패키징 (배포는 사용자만) |
| `docs-keeper` | `docs/`·`CLAUDE.md` 일관성 |
| `code-reviewer` | 읽기 전용 리뷰, 커밋 전 APPROVED 필요 |

의존성 설치, `npm publish`, 법적 문구 변경, 커밋·푸시는 에이전트가 하지 않고 사용자 확인을 거친다.

## 작업 방식

1인 프로젝트라 브랜치/PR 없이 `main`에서 직접 커밋하되, 커밋 전에는 `code-reviewer`의 APPROVED가 필요하다. 커밋 메시지는 한국어(`feat:`/`fix:`/`docs:`/`chore:`). `.claude/memory/`, `.claude/plans/`는 gitignore 대상이며 커밋하지 않는다.

## 메모리

`.claude/memory/MEMORY.md`에 프로젝트 결정 사항 인덱스가 있다(gitignore 대상). `save-memory` 스킬은 시스템 기본 auto memory 경로(`~/.claude/projects/...`)가 아니라 이 저장소의 `.claude/memory/`에 저장한다. 계좌번호·금액 같은 개인 금융정보와 시크릿은 메모리에도 쓰지 않는다.
