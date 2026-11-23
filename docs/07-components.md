# 07. Components — 컴포넌트

> **필수 규칙: 이 프로젝트의 UX/UI는 shadcn/ui 컴포넌트를 기반으로 만든다.**
> 새 UI 요소가 필요하면 직접 만들기 전에 shadcn 컴포넌트가 있는지 먼저 확인하고, 있으면 `npx shadcn@latest add <이름>`으로 추가해서 쓴다. shadcn에 없는 것만 직접 만든다. (스타일은 `components.json`의 `base-nova`, 변수 값은 `docs/09-shadcn-tokens.md`)

02~06번 값만 연결한다. 새 색·크기를 만들지 않는다.

## Components (shadcn 컴포넌트 기준)
- 주 버튼 — shadcn `Button` `variant="default"` + `size="lg"`: `--primary` 배경 + `--primary-foreground` 글자, 모서리 8px, 높이 48px, 16px/600, 화면당 하나만. 용도: "계좌번호 복사". 하단 고정 바에 둔다(아래)
- 금융앱 타일 — shadcn `Button` `variant="outline"`(기본 `size`: 높이 48px, 13px/400, 가로 `px-2`): 바탕 흰색 + 글자 기본 + 테두리 1px(평소 `border-border`), 모서리 8px. 선택된 타일만 검정(`border-primary`) 2px 테두리(아래 "타일 선택 상태" 참고). 4열 그리드(`grid grid-cols-4 gap-2`)에 앱 이름만 글자로 둔다(로고 없음). 문구는 "{앱 이름}로 송금하기"가 아니라 **앱 이름만**(예: "토스", "국민")
- 하단 고정 바 — `components/transfer/CopyBar.tsx`: `sticky bottom-0`, 위 테두리 1px(`border-t border-border`), 배경 `bg-background`, 아래 `pb-[env(safe-area-inset-bottom)]`(홈 인디케이터 영역 확보), 안쪽 `px-4 py-3`. 주 버튼만 담는다
- 헤더 — `components/transfer/TransferHeader.tsx`: 높이 48px(`h-12`)의 얇은 바, 아래 테두리 1px, 좌 "가스펄픽스"(13px/600) · 우 "송금 안내"(13px/400, 보조 색). 로고 이미지 없음
- 카드(입금 정보 표) — shadcn `Card` 기반: `--card` 배경, 모서리 12px, 테두리 1px, 그림자 없음(shadcn Card에 그림자·ring이 있으면 제거해서 06번에 맞춘다)
- 입력창 — **없음**(생기면 shadcn `Input`, 높이는 주 버튼과 통일)
- 칩·배지·탭·토글·하단 네비게이션 — **없음**(필요해지면 shadcn `Badge`/`Tabs`/`Toggle` 먼저 확인)

## shadcn 사용 규칙

| 규칙 | 내용 |
|---|---|
| 추가 방법 | `npx shadcn@latest add <이름>`. 파일은 `src/components/ui/`에 생긴다 |
| 우선순위 | ① shadcn 컴포넌트 그대로 → ② shadcn 컴포넌트 + `className` 오버라이드 → ③ 직접 제작(shadcn에 없을 때만) |
| `asChild` | 금지(base-nova). 링크 버튼은 `<a className={cn(buttonVariants({ variant: "outline" }), "w-full")}>` |
| 링크 | 커스텀 스킴(`supertoss://`)은 `next/link`가 아닌 일반 `<a>`로 연다(라우터가 가로채지 않게) |
| 색 | 변수 클래스만(`bg-primary`, `text-muted-foreground`). 팔레트 클래스·HEX 직접 입력 금지 |
| 수정 위치 | 버튼 크기·모양을 바꿀 때 호출부가 아니라 `components/ui/button.tsx`(정의)를 고친다 |
| 아이콘 | `lucide-react`. 이 화면에서는 필요한 곳에만, 금융앱 로고 대용으로 쓰지 않는다 |
| 클래스 병합 | `cn()`(`lib/utils.ts`) |

- 높이 48px: 모바일 터치 대상을 위해 `components/ui/button.tsx`의 size를 이 화면에 맞춰 정의했다(호출부마다 `h-12`를 반복하지 않는다). `size="default"`는 `h-12 px-2 text-[13px] font-normal`(앱 타일용), `size="lg"`는 `h-12 px-4 text-base font-semibold`(주 버튼용). 두 size 모두 높이는 48px이고 글자만 다르다.
- shadcn의 hover·focus·disabled 스타일은 그대로 쓴다. 새 색을 만들지 않는다.

## 구현 위치

| 컴포넌트 | 파일 |
|---|---|
| Button, Card | `src/components/ui/button.tsx`, `src/components/ui/card.tsx` (shadcn, 이 프로젝트 규칙에 맞게 정리) |
| 상태 분기·조합 | `src/components/TransferView.tsx` (로딩/유효하지 않음/정상 분기, `useCopy` 연결) |
| 화면 구성 요소 | `src/components/transfer/`: `TransferHeader`(헤더), `AmountHero`(금액 24px/600), `AccountCard`(입금 정보 표), `AppGrid`(앱 타일 4열 + 복사 안내), `GuideSteps`(3단계·고지), `CopyBar`(하단 고정 주 버튼), `InvalidLink`(유효하지 않음) |
| 복사 로직 | `src/hooks/useCopy.ts` (클립보드 복사·"복사됐어요" 상태의 단일 출처. 복사하는 곳은 모두 이 훅을 쓴다) |
| 화면 컨테이너 | `src/app/page.tsx` (`mx-auto flex min-h-dvh max-w-sm flex-col`, 좌우 여백 `px-4`는 각 구성 요소가 가진다) |

## 사용 조건

- **주 버튼은 화면당 1개**("계좌번호 복사"). 금융앱 버튼은 모두 `outline`이며, 앱이 여러 개가 돼도 `default` 버튼을 추가하지 않는다.
- **금융앱을 여는 타일 = 사전입력되는 앱만.** `lib/apps.ts`의 `FINANCE_APPS`에는 확인된 앱(현재 토스)만 등록한다. 토스 `buildUrl`이 `null`이면(은행 미인식) 타일을 숨기지 않고 **복사 타일로 대체**한다(`AppGrid`가 `buildUrl`이 `null`인 앱을 복사 타일 목록에 넣는다).
- **토스 외 앱(`COPY_GUIDE_APPS`: 국민·농협·카카오·신한·우리·하나·케뱅)은 앱을 열지 않는다.** 스킴이 확인되지 않아 URL 필드를 두지 않았다. 타일을 누르면 계좌번호를 복사하고 "계좌번호가 복사됐어요. {앱 이름} 앱을 열어 붙여넣어 주세요." 안내 문구(`role="status"`)를 타일 아래에 보여준다. 새 앱 스킴 추가는 실기기 확인 후 사용자 승인이 필요하다.
- **금융앱 로고·아이콘을 쓰지 않는다.** 글자 타일만. 상표를 쓰면 제휴로 오해될 수 있다.
- **타일 선택 상태: 검정 2px 테두리.** 복사 타일(앱 이름 타일)을 누르면 그 타일이 선택되어 `border-primary` 2px 테두리로 표시된다. 평소는 `border-border` 1px이다. 테두리를 1px로 통일하는 06번 규칙의 **유일한 예외**이며, 이유는 어느 앱을 눌렀는지(선택 상태)를 새 색 없이 구분하기 위해서다(포인트 색은 검정 유지, 파란색 금지). 구현은 호출부 className이 아니라 `components/ui/button.tsx` outline variant의 `aria-pressed:border-2 aria-pressed:border-primary`이고, `AppGrid`는 `aria-pressed={copiedAppName === app.name}`만 준다. 높이가 48px로 고정이라 두께가 바뀌어도 레이아웃이 밀리지 않는다. 한 번에 하나만 선택되며 다른 타일을 누르면 옮겨가고, 하단 "계좌번호 복사" 버튼을 누르면 선택이 해제된다. 토스 링크 타일은 앱을 여는 링크라 선택 테두리가 없다.
- **상태 변화는 새 색이 아니라 글자로.** 하단 바의 주 버튼은 복사 후 1.5초간 "복사됐어요"로 바뀐다(`useCopy`의 `copied`). 타일을 눌렀을 때의 안내 문구는 마지막으로 복사한 앱 이름으로 계속 보인다(`lastLabel`).
- 용어: **"송금"/"입금"**을 쓴다. "결제"는 쓰지 않는다(PG·카드 결제와 혼동).

## 체크리스트
- [ ] 새 UI 요소를 만들기 전에 shadcn에 있는지 확인했는가
- [ ] shadcn 컴포넌트를 `npx shadcn@latest add`로 추가했는가 (손으로 복사·재작성하지 않았는가)
- [ ] `asChild`를 쓰지 않았는가
- [ ] 주 버튼이 화면에 1개인가 (하단 고정 바)
- [ ] 앱 타일이 4열·글자만(로고 없음)이고 문구가 앱 이름만인가
- [ ] 토스 `buildUrl`이 `null`이어도 타일이 사라지지 않고 복사 타일로 바뀌는가
- [ ] 복사 타일을 누르면 그 타일만 검정 2px 테두리로 선택 표시되고(파란색 아님), 다른 타일을 누르면 옮겨가며, "계좌번호 복사" 버튼을 누르면 해제되는가
- [ ] 선택 표시가 호출부 className이 아니라 `ui/button.tsx` outline variant의 `aria-pressed:` 스타일이고, 토스 링크 타일에는 없는가
- [ ] 복사 동작이 `hooks/useCopy.ts`를 거치는가(컴포넌트에서 `navigator.clipboard`를 직접 부르지 않았는가)
- [ ] 버튼 크기·모양을 호출부가 아니라 `ui/button.tsx`에서 바꿨는가
- [ ] size 규칙이 지켜지는가 (`default` = h-12·13px/400 타일용, `lg` = h-12·16px/600 주 버튼용)
- [ ] 금융앱 로고·"결제" 표현이 없는가
