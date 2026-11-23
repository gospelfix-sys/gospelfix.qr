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
  --radius: 0.5rem; /* 8px — 버튼. 카드는 rounded-xl(12px) */

  --background: #ffffff;
  --foreground: #111827;

  --card: #f9fafb; /* 입금 정보 표 */
  --card-foreground: #111827;

  --popover: #ffffff;
  --popover-foreground: #111827;

  --primary: #000000;
  --primary-foreground: #ffffff;

  --secondary: #f3f4f6;
  --secondary-foreground: #111827;

  --muted: #f3f4f6;
  --muted-foreground: #6b7280;

  --accent: #f3f4f6;
  --accent-foreground: #111827;

  --destructive: #dc2626; /* 정의만 둔다. 02번에 상태 색을 추가하기 전에는 화면에 쓰지 않는다 */

  --border: #e5e7eb;
  --input: #e5e7eb;
  --ring: #111827;
}
```

| 02번 이름 | 변수 |
|---|---|
| 바탕 / 글자 기본 | `--background` / `--foreground` |
| 표면 | `--card` |
| 글자 보조 | `--muted-foreground` |
| 테두리 | `--border`, `--input` |
| 포인트 색 | `--primary` / `--primary-foreground` |
| 포인트 옅은 것 | `--secondary`, `--muted`, `--accent` |

## 운영 규칙

- **색은 변수 클래스로 쓴다**: `bg-primary`, `text-muted-foreground`, `border-border` 등. HEX·`gray-500` 같은 팔레트 클래스를 컴포넌트에 직접 쓰지 않는다. (shadcn 컴포넌트가 변수로 색을 읽기 때문에, 값을 바꾸면 전체가 따라와야 한다.)
- 포인트 색(`--primary`)만 바꿔 쓸 수 있게 두고, 파생값(`--radius-sm/md/lg`)을 개별로 덮어쓰지 않는다.
- **안 쓰는 블록은 만들지 않는다**: `--chart-*`, `--sidebar-*`, `.dark`(다크 테마 없음, 01번).
- 상태 색(`--destructive`)은 02번 표에 추가한 뒤에만 사용한다.
- `shadcn init`/`add`가 만든 값이 위 표와 다르면 **위 표 값으로 되돌린다**. 값이 맞는지는 `globals.css` diff로 확인한다.
- 사용자 앱의 브랜드 색(주황 `#ff5500`, `gf-*` 토큰)은 가져오지 않는다. 이 화면의 포인트는 검정이다(02번).

## 체크리스트
- [ ] 02~07번 값만 옮겼는가
- [ ] `components.json`이 사용자 앱과 같은가 (base-nova, neutral, cssVariables)
- [ ] 컴포넌트가 변수 클래스(`bg-primary` 등)로만 색을 참조하는가
- [ ] 안 쓰는 변수 블록(`--chart-*`, `--sidebar-*`, `.dark`)이 없는가
