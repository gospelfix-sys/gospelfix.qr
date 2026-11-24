import type { Config } from "tailwindcss";
import appConfig from "./tailwind.config";

// 라이브러리 CSS 전용 설정. 색 토큰 등 theme은 앱 설정을 그대로 쓰고,
// 스캔 대상은 패키지에 실리는 컴포넌트·훅으로 한정한다(src/app 제외).
const config: Config = {
  ...appConfig,
  content: ["./src/components/**/*.{ts,tsx}", "./src/hooks/**/*.{ts,tsx}"],
};

export default config;
