# 07. Components — 컴포넌트

> **필수 규칙: 이 프로젝트의 UX/UI는 shadcn/ui 컴포넌트를 기반으로 만든다.**
> 새 UI 요소가 필요하면 직접 만들기 전에 shadcn 컴포넌트가 있는지 먼저 확인하고, 있으면 `npx shadcn@latest add <이름>`으로 추가해서 쓴다. shadcn에 없는 것만 직접 만든다. (스타일은 `components.json`의 `base-nova`, 변수 값은 `docs/09-shadcn-tokens.md`)

02~06번 값만 연결한다. 새 색·크기를 만들지 않는다.

## Components (shadcn 컴포넌트 기준)
- 주 버튼 — shadcn `Button` `variant="default"` + `size="lg"`: `--primary` 배경(주황 #FF5500) + `--primary-foreground` 글자(검정 #111111, 5.9:1), 모서리 16px(`rounded-2xl`), 높이 48px, 16px/600, 화면당 하나만. 용도: "계좌번호 복사"(`/pay`)·"QR 만들기"(`/`). 하단 고정 바에 둔다(아래)
- 금융앱 타일 — shadcn `Button` `variant="outline"`(기본 `size`: 높이 48px, 13px/400, 가로 `px-2`): 바탕 흰색(`bg-card`) + 글자 기본 + 테두리 1px(평소 `border-border`), 모서리 16px(`rounded-2xl`). 선택된 타일만 검정(`border-foreground`) 2px 테두리(아래 "타일 선택 상태" 참고). 4열 그리드(`grid grid-cols-4 gap-2`)에 앱 이름만 글자로 둔다(로고 없음). 문구는 "{앱 이름}로 송금하기"가 아니라 **앱 이름만**(예: "토스", "국민")
- 하단 고정 바 — `components/transfer/CopyBar.tsx`: `sticky bottom-0`, 위 테두리 1px(`border-t border-border`), 배경 `bg-background`, 아래 `pb-[env(safe-area-inset-bottom)]`(홈 인디케이터 영역 확보), 안쪽 `px-4 py-3`. 주 버튼만 담는다
- 헤더 — `components/transfer/TransferHeader.tsx`: 높이 48px(`h-12`)의 얇은 바, 아래 테두리 1px, 좌 "가스펄픽스"(13px/600) · 우 화면 이름(13px/400, 보조 색. 기본 "송금 안내"(`/pay`), `/`(QR 만들기)는 `title="QR 만들기"`). 로고 이미지 없음
- 카드(입금 정보 표) — shadcn `Card` 기반: `--card` 배경(흰색, 바탕 베이지보다 밝음), 모서리 16px(`rounded-2xl`), 테두리 1px, 그림자 없음(shadcn Card에 그림자·ring이 있으면 제거해서 06번에 맞춘다)
- 입력창 — shadcn `Input`(`components/ui/input.tsx`): 높이 48px(`h-12`, 주 버튼과 통일), 16px/400(`text-base font-normal`, 16px 미만이면 iOS Safari가 포커스 때 화면 확대), 모서리 16px(`rounded-2xl`), 테두리 1px `border-input`, 배경 `bg-card`(흰색, 베이지 바탕 위에서 입력 영역이 보이게), 그림자 없음. 포커스는 `focus-visible:ring-2 ring-ring`(키보드 포커스 링만 허용, 06번). placeholder는 `text-muted-foreground`. 오류 상태는 `aria-invalid:border-foreground aria-invalid:border-2`(검정 2px, 빨강·주황 금지, 선택된 타일과 같은 방식. `border-primary`는 주황이라 쓰지 않는다)이고, 오류 문구는 입력창 아래에 기본 글자색 `font-semibold` + `role="alert"`로 둔다. `/`(QR 만들기)에서만 쓴다
- 선택(Select) — shadcn `Select`(`components/ui/select.tsx`): 트리거는 입력창과 같은 높이 48px·16px/400·`rounded-2xl`·`border-input`·`bg-card`. 팝업은 `rounded-2xl` + 테두리 1px + `bg-popover`, 그림자·애니메이션 없음, 항목 최소 높이 48px(선택된 항목만 600 + 체크 아이콘). 모바일에서 화면 밖으로 밀리지 않게 선택 항목을 트리거에 겹치지 않고 아래에 띄운다(`alignItemWithTrigger={false}`). 오류 상태는 Input과 같다(`aria-invalid` 시 `border-foreground` 2px 테두리). `/`(QR 만들기)의 은행 선택에만 쓴다
- QR 영역(`components/create/QrPreview.tsx`) — **바탕은 항상 흰색, 모듈은 검정**(스캔 안정성을 위해 테마와 무관하게 고정. SVG는 `fill="white"/"black"`, PNG 저장용 canvas는 `#ffffff`/`#000000`을 직접 쓴다. canvas는 CSS 변수를 읽지 못하고 둘 다 02번 색을 추가하는 것이 아니라 QR 규격 값이라서 변수 클래스 규칙의 예외다). 바깥 여백(quiet zone)은 4모듈, 테두리 1px + `rounded-2xl`(16px) + `overflow-hidden`, 폭은 컨테이너에 맞춘다. QR 위에 입금 정보 카드(`AccountCard`)를 두어 만든 사람이 은행·계좌번호·예금주를 QR과 대조할 수 있게 한다. QR·요약 카드 근처에 확인 안내 문구 B를 둔다(아래 "QR 만들기 화면 안내 문구"). 아래에 보조 버튼 2개(`outline`: "PNG로 저장"·"링크 복사")를 2열로 둔다. 주 버튼(`default`)은 "QR 만들기" 하나이며 본문 흐름 안에 둔다(`/`에는 하단 고정 바가 없다)
- 칩·배지·탭·토글·하단 네비게이션 — **없음**(필요해지면 shadcn `Badge`/`Tabs`/`Toggle` 먼저 확인)

## shadcn 사용 규칙

| 규칙 | 내용 |
|---|---|
| 추가 방법 | `npx shadcn@latest add <이름>`. 파일은 `src/components/ui/`에 생긴다 |
| 우선순위 | ① shadcn 컴포넌트 그대로 → ② shadcn 컴포넌트 + `className` 오버라이드 → ③ 직접 제작(shadcn에 없을 때만) |
| `asChild` | 금지(base-nova). 링크 버튼은 `<a className={cn(buttonVariants({ variant: "outline" }), "w-full")}>` |
| 링크 | 커스텀 스킴(`supertoss://`)은 `next/link`가 아닌 일반 `<a>`로 연다(라우터가 가로채지 않게) |
| 색 | 변수 클래스만(`bg-primary`, `text-muted-foreground`). 팔레트 클래스·HEX 직접 입력 금지. `bg-primary`(주황)는 주 버튼 전용 |
| 수정 위치 | 버튼 크기·모양을 바꿀 때 호출부가 아니라 `components/ui/button.tsx`(정의)를 고친다 |
| 아이콘 | `lucide-react`. 이 화면에서는 필요한 곳에만, 금융앱 로고 대용으로 쓰지 않는다 |
| 클래스 병합 | `cn()`(`lib/utils.ts`) |

- 높이 48px: 모바일 터치 대상을 위해 `components/ui/button.tsx`의 size를 이 화면에 맞춰 정의했다(호출부마다 `h-12`를 반복하지 않는다). `size="default"`는 `h-12 px-2 text-[13px] font-normal`(앱 타일용), `size="lg"`는 `h-12 px-4 text-base font-semibold`(주 버튼용). 두 size 모두 높이는 48px이고 글자만 다르다.
- shadcn의 hover·focus·disabled 스타일은 그대로 쓴다. 새 색을 만들지 않는다. 이 프로젝트에서 정한 예외 값은 아래 둘이다(`components/ui/button.tsx`).
  - 주 버튼(`default`) hover는 `hover:bg-primary/90`이다. `hover:bg-foreground`는 글자(`--primary-foreground`)도 #111111이라 글자가 사라져서 쓰지 않는다.
  - `link` variant 글자색은 `text-foreground`다(hover 시 밑줄). 링크에 주황(`text-primary`)을 쓰지 않는다(02번: 주황은 주 버튼에만).
- 브라우저 주소창 색(`src/app/layout.tsx`의 `themeColor`)은 `#f7f5f0`이다. 새 색이 아니라 02번 바탕(`--background`)을 그대로 재사용한 값이다(메타 태그는 CSS 변수를 읽지 못해 HEX로 적는다. QR 규격 값과 같은 변수 클래스 규칙의 예외).

## 구현 위치

| 컴포넌트 | 파일 |
|---|---|
| Button, Card, Input, Select | `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `select.tsx` (shadcn, 이 프로젝트 규칙에 맞게 정리) |
| 상태 분기·조합 | `src/components/TransferView.tsx` (로딩/유효하지 않음/정상 분기, `useCopy` 연결) |
| 화면 구성 요소 | `src/components/transfer/`: `TransferHeader`(헤더), `AmountHero`(금액 24px/600), `AccountCard`(입금 정보 표), `AppGrid`(앱 타일 4열 + 복사 안내), `GuideSteps`(3단계·고지), `CopyBar`(하단 고정 주 버튼), `InvalidLink`(유효하지 않음) |
| QR 만들기 화면 | `src/app/page.tsx`(헤더+`CreateForm` 조합만, 라우트 `/`), `src/components/create/CreateForm.tsx`(입력·검증 오류 표시·결과 상태), `QrPreview.tsx`(요약 카드 + QR `<svg>` + PNG 저장·링크 복사), `NoticeText.tsx`(안내 문구 공통 표시), `LegacyLinkRedirect.tsx`(옛 링크 호환: `/`에서 fragment가 있으면 `/pay`+fragment로 `location.replace`). 로직은 `lib/buildTransfer.ts`·`lib/qr.ts`·`BANK_OPTIONS`(`lib/apps.ts`) |
| 복사 로직 | `src/hooks/useCopy.ts` (클립보드 복사·"복사됐어요" 상태의 단일 출처. 복사하는 곳은 모두 이 훅을 쓴다) |
| 화면 컨테이너 | `src/app/page.tsx`(QR 만들기), `src/app/pay/page.tsx`(송금 화면, `TransferView` 조합) (`mx-auto flex min-h-dvh max-w-sm flex-col`, 좌우 여백 `px-4`는 각 구성 요소가 가진다) |

## 사용 조건

- **주 버튼은 화면당 1개**(송금 화면 `/pay`는 "계좌번호 복사", `/`는 "QR 만들기"). 금융앱 버튼은 모두 `outline`이며, 앱이 여러 개가 돼도 `default` 버튼을 추가하지 않는다.
- **금융앱을 여는 타일 = 사전입력되는 앱만.** `lib/apps.ts`의 `FINANCE_APPS`에는 확인된 앱(현재 토스)만 등록한다. 토스 `buildUrl`이 `null`이면(은행 미인식) 타일을 숨기지 않고 **복사 타일로 대체**한다(`AppGrid`가 `buildUrl`이 `null`인 앱을 복사 타일 목록에 넣는다).
- **토스 외 앱(`COPY_GUIDE_APPS`: 국민·농협·카카오·신한·우리·하나·케뱅)은 앱을 열지 않는다.** 스킴이 확인되지 않아 URL 필드를 두지 않았다. 타일을 누르면 계좌번호를 복사하고 "계좌번호가 복사됐어요. {앱 이름} 앱을 열어 붙여넣어 주세요." 안내 문구(`role="status"`)를 타일 아래에 보여준다. 새 앱 스킴 추가는 실기기 확인 후 사용자 승인이 필요하다.
- **금융앱 로고·아이콘을 쓰지 않는다.** 글자 타일만. 상표를 쓰면 제휴로 오해될 수 있다.
- **타일 선택 상태: 검정 2px 테두리.** 복사 타일(앱 이름 타일)을 누르면 그 타일이 선택되어 `border-foreground` 2px 테두리로 표시된다. 평소는 `border-border` 1px이다. 테두리를 1px로 통일하는 06번 규칙의 **유일한 예외**이며, 이유는 어느 앱을 눌렀는지(선택 상태)를 새 색 없이 구분하기 위해서다(상태를 위해 새 색을 만들지 않는다: 파란색·주황 금지. 주황은 주 버튼 전용). 구현은 호출부 className이 아니라 `components/ui/button.tsx` outline variant의 `aria-pressed:border-2 aria-pressed:border-foreground`이고, `AppGrid`는 `aria-pressed={copiedAppName === app.name}`만 준다. 높이가 48px로 고정이라 두께가 바뀌어도 레이아웃이 밀리지 않는다. 한 번에 하나만 선택되며 다른 타일을 누르면 옮겨가고, 하단 "계좌번호 복사" 버튼을 누르면 선택이 해제된다. 토스 링크 타일은 앱을 여는 링크라 선택 테두리가 없다.
- **상태 변화는 새 색이 아니라 글자로.** 하단 바의 주 버튼은 복사 후 1.5초간 "복사됐어요"로 바뀐다(`useCopy`의 `copied`). 타일을 눌렀을 때의 안내 문구는 마지막으로 복사한 앱 이름으로 계속 보인다(`lastLabel`).
- **금액 없는 송금 화면**: `Transfer.amount`가 `null`이면 `AmountHero`는 영역 자체를 그리지 않고(빈 칸·"0원" 금지), 토스 딥링크는 `amount`를 생략한다. 나머지 구성은 그대로다.
- **QR 만들기 화면(`/`) 안내 문구(확정, 한 글자도 바꾸지 않는다)**: 만든 사람이 QR의 성격을 알도록 두 문구를 쓴다.
  - 문구 A(화면 하단, QR 생성 전에도 항상 노출): "QR을 스캔한 사람이 금융앱에서 금액을 직접 입력해요. 링크를 받은 사람은 누구나 이 계좌 정보를 볼 수 있어요."
  - 문구 B(QR이 만들어졌을 때 QR·요약 카드 근처): "QR을 공유하기 전에 은행·계좌번호·예금주를 꼭 확인해 주세요."
  - 둘 다 보조 안내 문구(`text-muted-foreground`, 13px/400)이며 새 색을 쓰지 않는다. 구현 위치는 `components/create/`(`NoticeText`로 표시, A는 `CreateForm`, B는 `QrPreview`).
- **송금 화면 문구는 의도적으로 유지한다(결정 완료).** `GuideSteps`의 3단계("금액 확인" 포함)와 고지문은 금액 없는 링크에서도 그대로 보인다. 알려진 사실이며 어긋남이 아니다.
- 용어: **"송금"/"입금"**을 쓴다. "결제"는 쓰지 않는다(PG·카드 결제와 혼동).

## 체크리스트
- [ ] 새 UI 요소를 만들기 전에 shadcn에 있는지 확인했는가
- [ ] shadcn 컴포넌트를 `npx shadcn@latest add`로 추가했는가 (손으로 복사·재작성하지 않았는가)
- [ ] `asChild`를 쓰지 않았는가
- [ ] 주 버튼이 화면에 1개인가 (`/pay`는 하단 고정 바, `/`는 "QR 만들기"). 주황은 이 버튼에만 쓰였는가
- [ ] 앱 타일이 4열·글자만(로고 없음)이고 문구가 앱 이름만인가
- [ ] 토스 `buildUrl`이 `null`이어도 타일이 사라지지 않고 복사 타일로 바뀌는가
- [ ] 복사 타일을 누르면 그 타일만 검정 2px 테두리로 선택 표시되고(파란색·주황 아님), 다른 타일을 누르면 옮겨가며, "계좌번호 복사" 버튼을 누르면 해제되는가
- [ ] 선택 표시가 호출부 className이 아니라 `ui/button.tsx` outline variant의 `aria-pressed:` 스타일이고, 토스 링크 타일에는 없는가
- [ ] 입력창·선택이 `ui/input.tsx`·`ui/select.tsx`(48px, 16px/400, `rounded-2xl`, 그림자 없음)이고 호출부에서 높이·글자를 덮어쓰지 않았는가
- [ ] QR이 흰 바탕·검정 모듈·여백 4모듈이고, QR 위 요약 카드로 입력과 대조할 수 있는가(입력이 바뀌면 이전 QR이 지워지는가)
- [ ] `/`(QR 만들기)에 문구 A(항상)와 문구 B(QR 생성 후)가 위 확정 문구 그대로 있는가
- [ ] 오류 표시에 빨간색이 없고(`destructive` 없음), 오류 문구가 `font-semibold` + `role="alert"`, 오류 필드가 검정(`border-foreground`) 2px 테두리인가
- [ ] 금액이 없을 때 `AmountHero`가 사라지고 토스 딥링크에 `amount`가 없는가
- [ ] 복사 동작이 `hooks/useCopy.ts`를 거치는가(컴포넌트에서 `navigator.clipboard`를 직접 부르지 않았는가)
- [ ] 버튼 크기·모양을 호출부가 아니라 `ui/button.tsx`에서 바꿨는가
- [ ] size 규칙이 지켜지는가 (`default` = h-12·13px/400 타일용, `lg` = h-12·16px/600 주 버튼용)
- [ ] 금융앱 로고·"결제" 표현이 없는가
