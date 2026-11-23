# gospelfix.qr

가스펄픽스 입금 안내 중간 페이지. QR을 스캔하면 금융앱 목록을 보여주고, 누른 앱의 송금 화면으로 이동합니다.

## 링크 형식

```
https://<도메인>/pay#b=<은행>&a=<계좌번호>&m=<금액>&h=<예금주>
```

- 값은 모두 `#` 뒤(fragment)에 둡니다. fragment는 서버로 전송되지 않아 서버·CDN 로그에 계좌 정보가 남지 않습니다.
- `?query`는 사용하지 않습니다.
- `/`는 QR 만들기 화면이고, 송금 화면은 `/pay`입니다. 이전 형식(`/#b=...`)의 링크는 `/pay`로 자동 이동합니다.
- 잘못된 값(누락·범위 초과·제어 문자)은 "유효하지 않은 링크"로 처리합니다.

## 개발

```bash
yarn install --frozen-lockfile
yarn dev      # http://localhost:3000
yarn build    # 정적 export (out/)
```
