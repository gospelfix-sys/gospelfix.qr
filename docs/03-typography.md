# 03. Typography — 글자 크기 다섯 개

## Typography
- Font: 시스템 폰트(Tailwind 기본 `font-sans`). 한글은 OS 기본 한글 폰트(Apple SD Gothic Neo / Noto Sans KR / Malgun Gothic)로 떨어진다
- 화면 제목 18px / 굵기 600 — `text-lg font-semibold`
- 강조(버튼 글자, 카드 제목 자리) 16px / 굵기 600 — `text-base font-semibold`
- 본문·값 13px / 굵기 400(값은 600) — `text-[13px]`
- 섹션 제목 13px / 굵기 600 — `text-[13px] font-semibold`
- 부가 정보·고지 11px / 굵기 400 — `text-[11px]`
- 굵기는 400과 600만 쓴다
- 행간은 본문·고지 `leading-relaxed`(1.625), 제목은 기본(좁게)

## 이 프로젝트의 결정

- **웹폰트를 쓰지 않는다.** 폰트 CDN(Google Fonts 등) 요청은 방문자 IP·Referer가 외부로 나가는 외부 요청이다. 계좌 정보 화면에 외부 요청은 금지(`CLAUDE.md` 원칙)라 시스템 폰트만 쓴다. `next/font/google`도 빌드 시 자체 호스팅되긴 하지만 폰트 파일 추가 이득이 없어 쓰지 않는다.
- **카드 제목 자리는 비어 있다.** 입금 정보 표에는 제목 없이 라벨/값 행만 있어서, 이 자리의 16px은 버튼 글자가 대신 쓴다. 화면에 카드가 여러 개 생기면 그때 카드 제목을 16px/600으로 쓴다.
- **본문 13px은 모바일 하한에 가깝다.** 값(계좌번호·금액)은 `font-mono`/굵기로 강조하고, 11px는 안내·고지에만 쓴다. 11px 이하는 쓰지 않는다.
- **계좌번호는 `font-mono`.** 숫자 자릿수가 정렬되어 대조(오입금 방지)가 쉽다. 이 한 자리에만 쓴다.
- **금액은 `toLocaleString("ko-KR")` + "원".** 단위를 붙이지 않은 숫자만 보여주지 않는다.

## 체크리스트
- [ ] 정확히 5단계(18 / 16 / 13 / 13(굵게) / 11)인가
- [ ] 굵기가 400/600 두 종인가 (`font-bold`(700)·`font-medium`을 쓰지 않았는가)
- [ ] 11px 미만 글자가 없는가
- [ ] 외부 폰트·`@import url(...)`이 없는가
