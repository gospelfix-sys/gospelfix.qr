# 07. Components — 컴포넌트

> **필수 규칙: 이 프로젝트의 UX/UI는 shadcn/ui 컴포넌트를 기반으로 만든다.**
> 새 UI 요소가 필요하면 직접 만들기 전에 shadcn 컴포넌트가 있는지 먼저 확인하고, 있으면 `npx shadcn@latest add <이름>`으로 추가해서 쓴다. shadcn에 없는 것만 직접 만든다. (스타일은 `components.json`의 `base-nova`, 변수 값은 `docs/09-shadcn-tokens.md`)

02~06번 값만 연결한다. 새 색·크기를 만들지 않는다.

## Components (shadcn 컴포넌트 기준)
- 주 버튼 — shadcn `Button` `variant="default"`: `--primary` 배경 + `--primary-foreground` 글자, 모서리 8px, 높이 48px(`size`로 지정, 아래 참고), 화면당 하나만. 용도: "계좌번호 복사"
- 보조 버튼 — shadcn `Button` `variant="outline"`: 바탕 흰색 + 글자 기본 + 테두리 1px, 주 버튼과 같은 높이·모서리. 용도: "{앱 이름}로 송금하기" 링크 버튼(`<a>`)
- 카드(입금 정보 표) — shadcn `Card` 기반: `--card` 배경, 모서리 12px, 테두리 1px, 그림자 없음(shadcn Card에 그림자·ring이 있으면 제거해서 06번에 맞춘다)
- 입력창 — **없음**(생기면 shadcn `Input`, 높이는 주 버튼과 통일)
- 칩·배지·탭·토글·하단 네비게이션 — **없음**(필요해지면 shadcn `Badge`/`Tabs`/`Toggle` 먼저 확인)

## shadcn 사용 규칙

| 규칙 | 내용 |
|---|---|
| 추가 방법 | `npx shadcn@latest add <이름>`. 파일은 `src/components/ui/`에 생긴다 |
| 우선순위 | ① shadcn 컴포넌트 그대로 → ② shadcn 컴포넌트 + `className` 오버라이드 → ③ 직접 제작(shadcn에 없을 때만) |
| `asChild` | 금지(base-nova). 링크 버튼은 `<a className={buttonVariants({ variant: "outline" })}>` |
| 링크 | 커스텀 스킴(`supertoss://`)은 `next/link`가 아닌 일반 `<a>`로 연다(라우터가 가로채지 않게) |
| 색 | 변수 클래스만(`bg-primary`, `text-muted-foreground`). 팔레트 클래스·HEX 직접 입력 금지 |
| 수정 위치 | 버튼 크기·모양을 바꿀 때 호출부가 아니라 `components/ui/button.tsx`(정의)를 고친다 |
| 아이콘 | `lucide-react`. 이 화면에서는 필요한 곳에만, 금융앱 로고 대용으로 쓰지 않는다 |
| 클래스 병합 | `cn()`(`lib/utils.ts`) |

- 높이 48px: shadcn 기본 `Button` 크기(default 32px)는 모바일 터치 대상으로 작다. 전체 크기를 바꾸지 말고 **`size="lg"`를 `h-12`로 재정의**하거나 이 화면 전용 size를 `button.tsx`의 variants에 추가한다(호출부마다 `h-12`를 반복하지 않는다).
- shadcn의 hover·focus·disabled 스타일은 그대로 쓴다. 새 색을 만들지 않는다.

## 구현 위치

| 컴포넌트 | 파일 |
|---|---|
| Button, Card | `src/components/ui/button.tsx`, `src/components/ui/card.tsx` (shadcn) |
| 입금 정보 + 금융앱 목록 | `src/components/TransferView.tsx` (도메인 컴포넌트, shadcn 컴포넌트를 조합) |
| 화면 컨테이너 | `src/app/page.tsx` (`max-w-sm px-4 py-8`) |

## 사용 조건

- **주 버튼은 화면당 1개**("계좌번호 복사"). 금융앱 버튼은 모두 `outline`이며, 앱이 여러 개가 돼도 `default` 버튼을 추가하지 않는다.
- **금융앱 버튼 = 사전입력되는 앱만.** `lib/apps.ts`에 확인된 앱만 등록하고, 은행을 인식하지 못하면(`buildUrl`이 `null`) 버튼을 숨긴다. 미확인 앱은 "계좌번호 복사" 안내가 대신한다.
- **금융앱 로고·아이콘을 쓰지 않는다.** 텍스트 버튼만. 상표를 쓰면 제휴로 오해될 수 있다.
- **상태 변화는 새 색이 아니라 글자로.** 복사 후 1.5초간 "복사됨"으로 바뀐다.
- 용어: **"송금"/"입금"**을 쓴다. "결제"는 쓰지 않는다(PG·카드 결제와 혼동).

## 체크리스트
- [ ] 새 UI 요소를 만들기 전에 shadcn에 있는지 확인했는가
- [ ] shadcn 컴포넌트를 `npx shadcn@latest add`로 추가했는가 (손으로 복사·재작성하지 않았는가)
- [ ] `asChild`를 쓰지 않았는가
- [ ] 주 버튼이 화면에 1개인가
- [ ] 버튼 크기·모양을 호출부가 아니라 `ui/button.tsx`에서 바꿨는가
- [ ] 금융앱 로고·"결제" 표현이 없는가
