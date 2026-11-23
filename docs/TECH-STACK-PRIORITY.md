# 기술스택 선택 우선순위 원칙

새 의존성·도구를 넣거나 스택을 바꿀 때 위에서부터 순서대로 적용하는 판단 기준이다.
이 프로젝트(`gospelfix.pay`)는 사용자 앱 `gospelfix`의 형제 저장소이고, 실제 적용 사례는 맨 아래에 있다.

## 우선순위 (위에서부터)

1. **형제/레퍼런스 프로젝트가 있으면 그 버전과 동일하게 맞춘다.**
   레퍼런스는 사용자 앱 저장소(`gospelfix`)다. 패키지 버전·컨벤션·폴더 구조를 독자적으로 고르지 않고 그대로 따른다.
   한쪽에서 보안 패치로 버전을 올리면(예: `next` CVE 대응) **다른 쪽도 같이 올린다.**

2. **지금 당장 필요한 핵심 스택만 설치하고, 기능별 의존성은 그 기능을 만들 때 추가한다.**

   | 카테고리 | gospelfix.pay에서 고른 것 |
   |---|---|
   | 런타임/언어 | Node 24.x(`engines`), TypeScript 5 |
   | 프레임워크 | Next.js 14.2.35(App Router, `output: "export"` 정적 사이트) + React 18 |
   | 스타일링 | Tailwind CSS 3.4 (`postcss`) — v4 아님, 레퍼런스와 동일 |
   | UI 컴포넌트 | **shadcn/ui(필수)** — 설정은 루트 `components.json`(base-nova), 의존성은 `@base-ui/react`, `class-variance-authority`, `lucide-react`, `shadcn` CLI. 모든 UX/UI는 이 위에 만든다 |
   | 클래스 유틸 | `clsx`, `tailwind-merge` (`lib/utils.ts`의 `cn()`) |
   | 린트/포맷 | ESLint 8(`eslint-config-next` 14.2.35, `eslint-config-prettier`) + Prettier 3 |
   | 패키지 매니저 | yarn (`yarn.lock`만, npm 혼용 금지, 설치는 `--frozen-lockfile`) |

   **이 프로젝트에서 설치하지 않기로 한 것** — 정적 한 장짜리 페이지에는 필요 없고, 필요해질 때 그 시점에 결정한다.

   | 미룬/제외 | 이유 |
   |---|---|
   | Recoil, `axios`, `react-hook-form`+`zod` | 전역 상태·API 호출·폼이 없음 |
   | `motion` | 현재 움직이는 UI 없음. 생기면 사용자 앱 규칙(`motion/react`)을 따른다 |
   | `@supabase/*`, `cmsApiFetch` 등 서버 연동 | 백엔드 없음. 필요하면 `gospelfix.cms.api`에서 시작하고 BFF를 거친다 |
   | 분석·광고 SDK, 외부 폰트 | **금지**(계좌정보 화면, `CLAUDE.md` 원칙) |
   | `qrcode.react` | React 컴포넌트가 필요 없다. QR 만들기 화면(`/`)은 `qrcode-generator`(의존성 없는 순수 JS, 자체 타입)로 모듈 행렬만 만들고 `<svg>`를 직접 그린다 |

3. **기존에 동작하던 것은 세팅 단계에서 손대지 않는다.**
   환경 세팅과 기능 구현을 분리한다. 세팅 단계에서 `gospelfix` 쪽 코드는 건드리지 않는다.

4. **레퍼런스를 따르되 결함까지 복제하지 않는다.**
   버전·구조는 맞추되, 레퍼런스의 모노레포 시절 잔재(`Supabase` 문구, `frontend/`·`admin/` 경로)는 가져오지 않는다.
   (`.claude/GOSPELFIX.md`, `.claude/settings.json`에 남은 잔재가 이 사례다.)

5. **이미 확정된 디자인 자산은 재작성하지 않는다.**
   이 프로젝트는 이식할 레거시 디자인 자산이 없다. 대신 `docs/02~07`의 확정값을 코드 쪽이 따른다.
   (레퍼런스와 어긋나는 곳은 `docs/README.md`의 "현재 코드와 문서가 어긋난 곳" 참고.)

## 판단이 갈릴 때 (트리아지)

- **그대로 가져올 만한 부분**: 프레임워크·언어·스타일링 뼈대, `@/` 경로 별칭, Prettier·ESLint 설정, 코드 컨벤션(`any` 금지, props `interface`, 한국어 주석)
- **그대로 가져오면 안 되는 부분**: 인증·쿠키·BFF·결제·`CMS_API_KEY` 등 서버 구성, 배포·보안 구성(운영 환경 종속), 알려진 결함

## 검증 순서

세팅이나 의존성 변경을 보고하기 전에 최소한 다음을 확인한다.

1. `npx tsc --noEmit` → `yarn lint` → `yarn build`(`out/` 생성)가 에러 없이 통과하는가
2. `yarn.lock`이 불필요하게 재생성되지 않았는가 (`git diff --stat yarn.lock`)
3. 계좌정보가 `?query`·외부 요청·로그로 새는 경로가 생기지 않았는가 (빌드 결과 `out/`에 외부 URL이 없는지 확인)
4. 의존성을 추가했다면, 위 표의 "설치하지 않기로 한 것"과 충돌하지 않는가

---

## 적용 사례 (gospelfix.pay, 2026-11-23)

사용자 앱 `gospelfix`의 입금 팝업에서 QR을 스캔하면 금융앱 목록을 보여주는 정적 중간 페이지를 별도 저장소로 만들 때 적용한 결정이다.

- **레퍼런스**: `gospelfix`와 핵심 버전을 동일하게 맞췄다(Next.js 14.2.35, React 18, TypeScript 5, Tailwind 3.4, ESLint 8, yarn, Node 24.x). 설정 파일(`.eslintrc.json`, `.prettierrc`, `postcss.config.mjs`, `tsconfig.json`)을 복사해 쓰고, 이 프로젝트에 필요 없는 것(Recoil, axios 등)은 가져오지 않았다. `components.json`도 사용자 앱과 같은 내용으로 루트에 두었다(shadcn 패키지 설치는 코드 이전 시점에 진행).
- **핵심 스택만 설치한 정확한 패키지**:
  - 런타임: `next@14.2.35`, `react@^18`, `react-dom@^18`, `clsx@^2.1.1`, `tailwind-merge@^3.5.0`
  - 개발: `typescript@^5`, `@types/node@^20`, `@types/react@^18`, `@types/react-dom@^18`, `tailwindcss@^3.4.1`, `postcss@^8`, `eslint@^8`, `eslint-config-next@14.2.35`, `eslint-config-prettier@^10.1.8`, `prettier@^3.8.3`
- **`next.config.mjs`**: `output: "export"`, `images.unoptimized: true`. 서버가 없어 Route Handler·`serverFetch`를 쓰지 않는다.
- **레퍼런스의 결함은 복제하지 않음**: 사용자 앱의 `images.unoptimized`는 Vercel 402 임시 우회지만, 이 프로젝트는 정적 export라 이미지 최적화가 애초에 불가능해 같은 값이어도 이유가 다르다.
- **리뷰에서 걸러진 것**: 금액 상한·`isSafeInteger`(`1e21` 방지), 제어·bidi 문자 거절, raw `<button>`의 `ui/Button.tsx` 분리(이후 shadcn `button.tsx`로 교체 완료). 그대로 `docs/08-guidelines.md`의 DON'T와 증상표에 반영했다.
- **미룬 것**: 링크 위조 방지 서명(ECDSA)과 공개키 검증, 금융앱 추가(스킴 확인 후), 실기기 확인, Vercel 프로젝트·도메인.

관련 문서: `CLAUDE.md`(프로젝트 원칙), `components.json`(shadcn 설정), `docs/DESIGN.md`(디자인 규칙 인덱스).
