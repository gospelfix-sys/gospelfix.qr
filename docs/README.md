# docs — gospelfix.pay 디자인·기술 문서

화면을 만들거나 고칠 때 AI에게 같이 주는 규칙 모음입니다. 범용 템플릿이 아니라 **이 프로젝트의 확정값**으로 채워져 있습니다.

## 파일 구성

| 파일 | 내용 |
|---|---|
| `components.json` (루트, docs 밖) | shadcn 설정(단일 출처). `shadcn add`가 읽는다 |
| `DESIGN.md` | 01~09를 `@docs/...`로 불러오는 참조 인덱스. 화면 작업 때마다 AI에게 전달 |
| `design.shadcn.md` | 01~09 확정값을 한 장으로 요약. 한 번에 붙여넣을 때 사용 |
| `01-style-reference.md` | 서비스 성격, 분위기 단어 3개, 테마·화면 크기, 화면 상태 |
| `02-colors.md` | 색 7개 (Tailwind gray 팔레트 + 검정 포인트) |
| `03-typography.md` | 글자 5단계, 굵기 400/600, 시스템 폰트 |
| `04-spacing.md` | 4px 스케일, 자리별 여백 |
| `05-radius.md` | 버튼 8 / 카드 12 / 원형 999 |
| `06-elevation.md` | 테두리만 사용, 그림자 없음 |
| `07-components.md` | 주/보조 버튼·카드 정의와 구현 위치, 사용 조건 |
| `08-guidelines.md` | DO / DON'T, 증상별 원인 체크표 |
| `09-shadcn-tokens.md` | 02~07 값 ↔ shadcn CSS 변수(`globals.css :root`) 대응, `components.json` 사용법 |
| `TECH-STACK-PRIORITY.md` | 스택 선택 우선순위와 gospelfix.pay 적용 사례 |

## 쓰는 법

1. 화면·컴포넌트를 만들기 전에 `DESIGN.md`(또는 `design.shadcn.md`)를 AI에게 같이 준다. 세션이 바뀌면 AI는 이전 규칙을 기억하지 못한다.
2. 값이 어긋나면 **번호 파일(01~09)이 우선**이다. `design.shadcn.md`와 `CLAUDE.md`는 그에 맞춰 고친다.
3. 마음에 안 드는 결과가 나오면 `08-guidelines.md`의 DON'T에 한 줄 추가한다.
4. 새 색·굵기·간격·모서리가 필요하면 코드보다 **먼저 해당 번호 파일의 표에 추가**하고 이유를 적는다.

## 핵심 원칙

- **모든 UX/UI는 shadcn/ui 컴포넌트를 기반으로 만든다.** 설정은 루트 `components.json`, 컴포넌트 추가는 `npx shadcn@latest add <이름>`.
- 목록보다 금지가 잘 지켜진다. "쓰지 않는다"까지 명시한다.
- 개수를 지킨다: 색 7개, 글자 5단계, 굵기 2종, 간격 6단계, 모서리 3종.
- 이 화면은 돈과 계좌번호를 다룬다. 장식보다 **대조 가능성(오입금 방지)과 신뢰**가 우선이다.
- 외부 요청 금지: 폰트·이미지·분석 스크립트를 추가하지 않는다 (`CLAUDE.md`).

## 현재 코드와 문서가 어긋난 곳 (코드를 문서에 맞출 때 참고)

문서는 목표 상태이고, 아래는 지금 `src/`가 문서와 다른 부분입니다. 아직 코드는 바꾸지 않았습니다.

| 위치 | 현재 코드 | 문서 기준 |
|---|---|---|
| shadcn 미설치 | `components.json`만 있고 `@base-ui/react`·`class-variance-authority`·`lucide-react`·`globals.css` 변수·`lib/utils.ts` 없음 | 09번 변수를 `globals.css`에 넣고 `shadcn add button card` |
| `ui/Button.tsx` | 직접 만든 버튼 | shadcn `button.tsx`(default/outline)로 교체 — 07번 |
| `TransferView.tsx` 제목·값 | `font-bold`(700) 5곳 | `font-semibold`(600) — 03번 |
| `TransferView.tsx` 제목 | `text-lg font-bold` | `text-lg font-semibold` |
| `ui/Button.tsx` 보조 버튼 | `border-gray-300` | `border-border`(#E5E7EB) — 02번 (경계가 약해 보이면 02번에 컨트롤 테두리를 추가하는 쪽을 먼저 결정) |
