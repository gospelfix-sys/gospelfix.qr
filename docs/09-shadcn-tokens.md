# 09. shadcn 토큰 — 값을 코드에 옮기는 칸

이 프로젝트의 UI는 **shadcn/ui 컴포넌트를 기반**으로 만든다(`07-components.md`). shadcn은 색·모서리를 CSS 변수로 읽으므로, 02~07에서 정한 값을 `src/app/globals.css`의 `:root`에 옮긴다. **여기서 새 값을 만들지 않는다.**
변수 이름은 shadcn 규약 그대로이고, `--이름`은 배경 / `--이름-foreground`는 그 위의 글자다.

## shadcn 설정 — 프로젝트 루트의 `components.json`

설정의 **단일 출처는 `components.json`**(프로젝트 루트)이다. 이 문서에 사본을 적지 않는다. 사용자 앱과 같은 내용(base-nova, neutral, cssVariables, lucide, `@/` 별칭)을 유지하고, 바꿀 일이 생기면 사용자 앱 쪽도 함께 맞춘다.

- 컴포넌트는 `npx shadcn@latest add <이름>`으로 추가한다. 손으로 복사해 만들지 않는다.
- **`asChild` 금지**(base-nova는 `@base-ui/react` 기반). 링크 버튼은 `<a className={buttonVariants({ variant })}>`.
- `lib/utils.ts`의 `cn()`(clsx + tailwind-merge)을 쓴다.

## 변수 값 (라이트 한 가지 테마)

```css
:root {
  --radius: 1rem; /* 16px — 버튼·타일·입력창·선택·카드·QR 틀 모두. 클래스는 rounded-2xl */

  --background: #f7f5f0; /* 화면 배경(베이지) */
  --foreground: #111111;

  --card: #ffffff; /* 입금 정보 표. 바탕보다 밝다 */
  --card-foreground: #111111;

  --popover: #ffffff;
  --popover-foreground: #111111;

  --primary: #ff5500; /* 주황. 주 버튼에만 */
  --primary-foreground: #111111; /* 흰색이면 3.2:1이라 검정(5.9:1) */

  --secondary: #f0eee8;
  --secondary-foreground: #111111;

  --muted: #f0eee8;
  --muted-foreground: #6b6b66; /* 사이트의 #888은 3.2:1이라 쓰지 않는다. 바탕 4.9:1 */

  --accent: #f0eee8; /* 사이트의 주황 틴트(rgba)는 쓰지 않는다 */
  --accent-foreground: #111111;

  --destructive: #dc2626; /* 정의만 둔다. 오류도 검정으로 표시하므로 화면에 쓰지 않는다 */

  --border: #e8e5df;
  --input: #e8e5df;
  --ring: #111111; /* 포커스 링은 어두운 색(주황은 바탕 대비 2.9:1) */
}
```

| 02번 이름 | 변수 |
|---|---|
| 바탕 / 글자 기본 | `--background` / `--foreground` |
| 표면 | `--card`, `--popover` |
| 글자 보조 | `--muted-foreground` |
| 테두리 | `--border`, `--input` |
| 포인트 색 | `--primary` / `--primary-foreground` |
| 보조 면 | `--secondary`, `--muted`, `--accent` |

## 운영 규칙

- **색은 변수 클래스로 쓴다**: `bg-primary`, `text-muted-foreground`, `border-border` 등. HEX·`gray-500` 같은 팔레트 클래스를 컴포넌트에 직접 쓰지 않는다. (shadcn 컴포넌트가 변수로 색을 읽기 때문에, 값을 바꾸면 전체가 따라와야 한다.)
- 포인트 색(`--primary`, 주황)은 주 버튼에만 쓴다. 오류·선택 테두리는 `border-foreground`(검정)이지 `border-primary`가 아니다. 모서리 파생값(`--radius-sm/md/lg`)을 개별로 덮어쓰지 않는다.
- **안 쓰는 블록은 만들지 않는다**: `--chart-*`, `--sidebar-*`, `.dark`(다크 테마 없음, 01번).
- 상태 색(`--destructive`)은 화면에서 쓰지 않는다(오류도 검정 + 굵기·`border-foreground` 2px 테두리로 표시, 02·07번). 사용하려면 02번 표에 먼저 추가한다.
- `shadcn init`/`add`가 만든 값이 위 표와 다르면 **위 표 값으로 되돌린다**. 값이 맞는지는 `globals.css` diff로 확인한다.
- 포인트 색은 사용자 앱·브랜드 사이트와 같은 주황 `#ff5500`이다(2026-11-23 결정, 02번). 단 사용자 앱의 `gf-*` 토큰 이름은 가져오지 않고 shadcn 변수만 쓴다. 폰트(Pretendard)는 외부 폰트 금지라 가져오지 않는다.

## 체크리스트
- [ ] 02~07번 값만 옮겼는가 (`--primary` #ff5500, `--primary-foreground` #111111, `--muted-foreground` #6b6b66, `--radius` 1rem)
- [ ] `components.json`이 사용자 앱과 같은가 (base-nova, neutral, cssVariables)
- [ ] 컴포넌트가 변수 클래스(`bg-primary` 등)로만 색을 참조하는가
- [ ] 버튼 size가 `ui/button.tsx`의 정의(`default` = h-12·13px/400 타일용, `lg` = h-12·16px/600 주 버튼용)와 07번 규칙에 맞는가
- [ ] 타일 선택 상태가 `aria-pressed`로 표현되고, 검정(`border-foreground`) 2px 스타일을 호출부가 아니라 정의 파일(`ui/button.tsx`)에서 처리하는가 (06번의 테두리 1px 규칙의 유일한 예외)
- [ ] 안 쓰는 변수 블록(`--chart-*`, `--sidebar-*`, `.dark`)이 없는가
