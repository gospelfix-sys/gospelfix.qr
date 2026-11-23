# 멀티에이전트 오케스트레이션

gospelfix.qr의 작업은 **메인 세션(오케스트레이터)** 이 전문 서브에이전트에게 위임하고 결과를 취합하는 방식으로 진행한다. 참고: Claude Managed Agents의 멀티에이전트 오케스트레이션(서브에이전트·병렬화·전문화·에스컬레이션) 개념을 Claude Code의 `.claude/agents/` 에 맞춰 적용했다.

## 1. 구조

```
사용자
  └─ 메인 세션 = 오케스트레이터 (계획·위임·취합·사용자 확인·커밋)
        ├─ transfer-logic   송금 로직 (src/lib/**)
        ├─ ui-writer        shadcn 기반 UI (src/components/**, globals.css)
        ├─ package-builder  npm 패키징 (package.json, 빌드 설정, index.ts, README)
        ├─ docs-keeper      문서 일관성 (docs/**, CLAUDE.md, .claude/rules/**)
        └─ code-reviewer    읽기 전용 리뷰·커밋 게이트 (수정 권한 없음)
```

- **위임은 한 단계만.** 서브에이전트는 다른 서브에이전트를 부르지 못한다. 에이전트 간 인계는 반드시 오케스트레이터를 거친다("인계 필요" 항목을 읽고 다음 에이전트를 호출).
- **정의된 에이전트만 쓴다.** 임의의 범용 에이전트에 이 프로젝트의 규칙 파일 수정을 맡기지 않는다.
- 각 에이전트는 **자기 컨텍스트가 분리**되어 있다. 위임할 때 필요한 배경(목표, 대상 파일, 제약, 이미 내린 결정)을 프롬프트에 직접 적는다. "아까 말한 대로" 같은 표현은 통하지 않는다.
- **파일 시스템은 공유**된다. 같은 파일을 두 에이전트가 동시에 수정하면 충돌한다 → 아래 소유권 표를 지킨다.

## 2. 파일 소유권 (동시 수정 방지)

| 경로 | 수정 담당 | 다른 에이전트는 |
|---|---|---|
| `src/lib/**` | transfer-logic | 읽기만, 변경 필요 시 보고 |
| `src/components/**`, `src/app/**`, `tailwind.config.ts` | ui-writer | 읽기만 |
| `package.json`, `tsup.config.ts`, `src/index.ts`, 루트 `README.md`(npm 소비자용) | package-builder | 읽기만 |
| `docs/**`, `CLAUDE.md`, `.claude/rules/**` | docs-keeper | 읽기만 |
| (모든 파일) | code-reviewer | **수정 권한 없음** |

`components.json` 은 단일 출처이므로 오케스트레이터가 사용자와 확정한 뒤에만 바꾼다.

## 3. 작업 라우팅

| 요청 | 담당 | 순서 |
|---|---|---|
| fragment 검증·금액/계좌 규칙·금융앱 추가·딥링크 | transfer-logic | → code-reviewer → docs-keeper(규칙이 바뀐 경우) |
| 화면·컴포넌트·스타일·shadcn 이전 | ui-writer | → code-reviewer → docs-keeper(어긋남 표 갱신) |
| npm 배포 준비(빌드·exports·README·tarball 검증) | package-builder | → code-reviewer |
| 디자인 규칙·문서 수정 | docs-keeper | → code-reviewer |
| 법적 문구(고지·면책·로고·"결제" 표현) | **사용자에게 먼저 알린다.** 에이전트가 직접 바꾸지 않는다 | 사용자 확인 후 해당 담당 |
| 커밋·푸시 요청 | code-reviewer 먼저 | APPROVED 후 오케스트레이터가 직접 커밋 |

## 4. 병렬 vs 순차

- **병렬:** 서로 다른 소유 파일을 다루고 한쪽 결과가 다른 쪽 입력이 아닐 때. 예) shadcn 이전의 `ui-writer` 와 라이브러리 빌드 골격의 `package-builder`, 로직 변경 중 문서 현황 점검 `docs-keeper`. 병렬로 시킬 때는 **한 응답에서 함께 호출**한다.
- **순차:** 시그니처·export 가 다른 작업의 입력일 때(예: `transfer-logic` 이 함수 시그니처를 바꾼 뒤 `ui-writer`·`package-builder`). `code-reviewer` 는 항상 구현 에이전트가 끝난 **뒤**에 실행한다.
- 독립적인 읽기 점검(예: 문서 점검과 코드 점검)은 병렬이 빠르다. 의존이 있으면 순차로 한다.
- 에이전트를 필요한 작업에만 쓴다. 한 줄 문구 수정 같은 사소한 작업은 오케스트레이터가 직접 `Edit` 한다(에이전트마다 컨텍스트를 새로 읽어 비용이 든다).

## 5. 인계 계약

모든 구현 에이전트는 다음 형식으로 보고한다(각 에이전트 정의에 세부 형식이 있다): **결과(변경 파일·요지) / 검증 / 인계 필요 / 미해결·주의**.

오케스트레이터는 취합할 때:
1. "인계 필요" 항목을 다음 에이전트의 프롬프트로 옮긴다.
2. 에이전트들의 결과가 서로 모순되면(예: 문서의 값과 코드의 값) 임의로 한쪽을 고르지 말고, 번호 파일(`docs/01~09`)을 기준으로 정하거나 사용자에게 묻는다.
3. 사용자에게는 에이전트 보고를 그대로 붙이지 않고, 변경 요지·검증 결과·남은 일을 한 번에 요약한다.

## 6. 실패 처리

- 한 에이전트가 실패하거나 일부만 끝내도 전체를 멈추지 않는다. 처리하지 못한 항목을 "미해결"로 표시해 두고 나머지를 진행한 뒤 마지막에 보고한다.
- 같은 문제로 에이전트를 반복 호출하지 않는다. 두 번 실패하면 원인을 정리해 사용자에게 묻는다.
- `code-reviewer` 가 BLOCKED 이면 지적 사항을 담당 에이전트(또는 문서면 docs-keeper)에게 넘겨 고친 뒤 **재리뷰**한다. 커밋은 APPROVED 이후에만 한다.

## 7. 사용자 승인이 필요한 일 (에이전트가 하지 않는다)

- 새 의존성 설치(`tsup`, `@base-ui/react`, `class-variance-authority`, `lucide-react`, `shadcn` CLI 등)와 락파일 변경
- `npm login`, `@gospelfix` 조직 생성, **`npm publish`** 및 배포 직전 최종 확인
- 법적 문구 변경, 새 금융앱 스킴 추가(공개 목록 출처 + 실기기 확인 필요)
- `git commit`/`git push` (code-reviewer APPROVED 후에도 사용자의 커밋 요청이 있을 때만)
- `components.json`·`.claude/settings.json` 변경

## 8. 기록

- 이 프로젝트의 결정 사항은 메모리(`.claude/memory/`, gitignore 대상)에, 공개 가능한 규칙은 이 `rules/` 와 `docs/` 에 둔다. 공개 저장소이므로 사업·결제·내부 정보는 `rules/`·`docs/` 에 쓰지 않는다.
