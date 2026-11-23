# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

가스펄픽스 입금 안내 중간 페이지. QR을 스캔하면 금융앱 버튼 목록을 보여주고, 누른 앱의 송금 화면으로 이동시킨다.
코드 컨벤션은 사용자 앱(`gospelfix` 저장소의 `CLAUDE.md`)을 따르되, 이 저장소는 정적 사이트라 BFF·Recoil은 쓰지 않는다.

## 명령어

```bash
yarn dev          # http://localhost:3002
yarn build        # out/ 생성 (output: "export")
yarn lint         # next lint
npx tsc --noEmit  # 타입 체크
```

패키지 매니저는 yarn, 설치는 `yarn install --frozen-lockfile`(npm 금지, Node 24.x). 테스트 스위트는 없다. 검증은 `tsc --noEmit` → `yarn lint` → `yarn build` 순서로 한다. 순수 함수(`parseTransferHash` 등)는 저장소 밖 스크래치 스크립트로 정상/경계/변조 입력을 확인한다(가짜 계좌번호만 사용, 커밋 금지).
`yarn pretty`는 src 전체를 포맷하므로 문구 몇 줄 수정에는 쓰지 않는다(Prettier: 쌍따옴표·세미콜론·100자·trailing comma all).

## 아키텍처

서버·DB·API·환경변수가 없는 정적 사이트다. 계좌정보는 **URL fragment로만** 흐른다.

```
gospelfix 앱 팝업(QR)  ──>  https://<pay>/#b=&a=&m=&h=
                              │ (fragment는 서버로 전송되지 않음)
                    page.tsx ─> TransferView(클라이언트)
                                  ├─ lib/parseTransfer.ts  hash 문자열 파싱·검증(`parseTransferHash`, hash는 TransferView가 읽음) (실패 시 "유효하지 않은 링크")
                                  └─ lib/apps.ts           FINANCE_APPS[].buildUrl(transfer) → 앱 딥링크
```

- `lib/parseTransfer.ts`: 모든 입력 검증의 단일 관문. 화면과 딥링크에는 `parseTransferHash`를 통과한 값만 쓴다(금액 상한·`isSafeInteger`, 제어·bidi 문자 거절, 예금주·은행명 길이, 계좌 숫자 6~20자).
- `lib/apps.ts`: `FinanceApp { id, name, prefilled, buildUrl }` 목록. 현재 확인된 앱은 토스(`supertoss://send?bank=&accountNo=&amount=`, 비공식 스펙)뿐이며, 은행명 별칭 정규화(`normalizeTossBankName`)에 실패하면 `buildUrl`은 `null`을 돌려준다. 미확인 앱은 추가하지 않고 "계좌번호 복사"로 대체한다.
- `components/TransferView.tsx`: 상태 분기(로딩/유효하지 않음/정상)와 조합만 맡는다. 화면 구성은 `components/transfer/`에 나뉘어 있다: `TransferHeader`(얇은 헤더), `AmountHero`(금액 24px/600), `AccountCard`(입금 정보 표), `AppGrid`(금융앱 타일 4열, 글자만), `GuideSteps`(3단계·고지), `CopyBar`(하단 고정 바의 주 버튼), `InvalidLink`.
- `AppGrid`: 토스(`FINANCE_APPS`)는 `buildUrl` 결과가 있으면 앱을 여는 `<a>` 타일이고, `null`이면 숨기지 않고 복사 타일로 대체한다. 토스 외 앱(`COPY_GUIDE_APPS`)은 앱을 열지 않고 계좌번호 복사 + 안내 문구만 보여준다. 타일 문구는 앱 이름만이다.
- `hooks/useCopy.ts`: 클립보드 복사와 "복사됐어요" 상태의 **단일 출처**. 복사하는 곳은 `navigator.clipboard`를 직접 부르지 않고 이 훅을 쓴다(`"use client"`).
- `components/ui/button.tsx`·`card.tsx`: shadcn(base-nova)을 Tailwind 3.4·이 프로젝트 디자인 규칙에 맞게 정리한 것. `size="default"`(h-12, 13px/400)는 앱 타일용, `size="lg"`(h-12, 16px/600)는 주 버튼용이다. 어긋난 곳 목록은 `docs/README.md`.
- 링크 서명(ECDSA 위조 방지)은 미구현이다. 구현하면 서명 발급은 `gospelfix` 앱 서버, 이 저장소는 공개키 검증만 맡는다.

## 원칙

- **모든 UX/UI는 shadcn/ui 컴포넌트(base-nova)를 기반으로 만든다.** 설정은 루트 `components.json`, 추가는 `npx shadcn@latest add <이름>`, `asChild` 금지(링크 버튼은 `<a className={buttonVariants({variant})}>`). 값·규칙은 `docs/DESIGN.md`(→ `docs/07-components.md`, `docs/09-shadcn-tokens.md`)를 따른다. 색은 CSS 변수 클래스(`bg-card`, `border-border` 등)만 쓴다.
- **계좌정보는 URL fragment(`#b=&a=&m=&h=`)로만 받는다.** `?query`로 바꾸지 않는다.
- 백엔드가 필요해지면 `gospelfix.cms.api`에서 시작하고, 이 앱은 직접 호출하지 않는다.
- `noindex`. 분석 스크립트·외부 요청·콘솔 로그·외부 폰트 금지.
- 가스펄픽스 서비스 전용. 금융앱 로고는 쓰지 않고, "결제"가 아니라 "송금"이라고 표기한다. 면책 단정 문구는 쓰지 않는다.
- 화면에는 편의 기능·제휴 아님·보내기 전 확인 안내를 항상 노출한다.
- 커스텀 스킴(`supertoss://`)은 `next/link`가 아닌 일반 `<a>`로 연다.
- shadcn 관련 패키지(`@base-ui/react`, `class-variance-authority`, `lucide-react`)와 `lib/utils.ts`(`cn`), `globals.css`의 CSS 변수는 이미 들어와 있다. 새 shadcn 컴포넌트·의존성 추가는 사용자 승인 후에 한다.

## 라이브러리화 계획

`@gospelfix/pay`로 npm에 배포해 여러 프로젝트에서 쓸 계획이다(범위: 로직 + React UI). 아직 착수 전이며 `package.json`은 `private: true`다. 그래서 `src/lib/**`는 react·next·window에 의존하지 않는 순수 TS로 유지하고, 컴포넌트는 `next/*` 없이 props만으로 동작하게 쓴다. `npm publish`·`npm login`은 사용자만 실행한다.

## 서브에이전트 (오케스트레이션)

메인 세션이 오케스트레이터가 되어 전문 서브에이전트(`.claude/agents/`)에게 위임하고 결과를 취합한다. 역할·파일 소유권·병렬/순차 기준·승인이 필요한 일은 `.claude/rules/orchestration.md`를 따른다.

| 에이전트 | 맡는 일 |
|---|---|
| `transfer-logic` | 송금 로직 (`src/lib/**`: 파싱·검증·딥링크) |
| `ui-writer` | shadcn 기반 UI (`src/components/**`, `globals.css`) |
| `package-builder` | `@gospelfix/pay` npm 패키징 (배포는 사용자만) |
| `docs-keeper` | `docs/`·`CLAUDE.md` 일관성 |
| `code-reviewer` | 읽기 전용 리뷰, 커밋 전 APPROVED 필요 |

의존성 설치, `npm publish`, 법적 문구 변경, 커밋·푸시는 에이전트가 하지 않고 사용자 확인을 거친다.

## 작업 방식

1인 프로젝트라 브랜치/PR 없이 `main`에서 직접 커밋하되, 커밋 전에는 `code-reviewer`의 APPROVED가 필요하다. 커밋 메시지는 한국어(`feat:`/`fix:`/`docs:`/`chore:`). `.claude/memory/`, `.claude/plans/`는 gitignore 대상이며 커밋하지 않는다.

## 메모리

`.claude/memory/MEMORY.md`에 프로젝트 결정 사항 인덱스가 있다(gitignore 대상). `save-memory` 스킬은 시스템 기본 auto memory 경로(`~/.claude/projects/...`)가 아니라 이 저장소의 `.claude/memory/`에 저장한다. 계좌번호·금액 같은 개인 금융정보와 시크릿은 메모리에도 쓰지 않는다.
