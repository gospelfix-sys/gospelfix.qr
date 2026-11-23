# CLAUDE.md

가스펄픽스 입금 안내 중간 페이지. QR을 스캔하면 금융앱 버튼 목록을 보여주고, 누른 앱의 송금 화면으로 이동시킨다.
코드 컨벤션은 사용자 앱(`gospelfix` 저장소의 `CLAUDE.md`)을 따르되, 이 저장소는 정적 사이트라 BFF·Recoil은 쓰지 않는다.

## 원칙

- **모든 UX/UI는 shadcn/ui 컴포넌트(base-nova)를 기반으로 만든다.** 설정은 루트 `components.json`, 추가는 `npx shadcn@latest add <이름>`, `asChild` 금지. 값·규칙은 `docs/DESIGN.md`(→ `docs/07-components.md`, `docs/09-shadcn-tokens.md`)를 따른다.
- **계좌정보는 URL fragment(`#b=&a=&m=&h=`)로만 받는다.** fragment는 서버로 전송되지 않아 로그에 남지 않는다. `?query`로 바꾸지 않는다.
- `output: "export"` 정적 사이트. 서버·DB·API·환경변수 없음. 백엔드가 필요해지면 `gospelfix.cms.api`에서 시작하고, 이 앱은 직접 호출하지 않는다.
- `noindex`. 분석 스크립트·외부 요청·콘솔 로그·외부 폰트 금지.
- 가스펄픽스 서비스 전용. 금융앱 로고는 쓰지 않고, "결제"가 아니라 "송금"이라고 표기한다.
- 화면에는 편의 기능·제휴 아님·보내기 전 확인 안내를 항상 노출한다.
- 커스텀 스킴(`supertoss://`)은 `next/link`가 아닌 일반 `<a>`로 연다. 확인된 앱 스킴만 `lib/apps.ts`에 추가한다.

## 명령어

```bash
yarn dev          # http://localhost:3002
yarn build        # out/ 생성
yarn lint
npx tsc --noEmit
```

패키지 매니저는 yarn, 설치는 `yarn install --frozen-lockfile`.

## 메모리

`.claude/memory/MEMORY.md`에 프로젝트 결정 사항 인덱스가 있다(gitignore 대상).
