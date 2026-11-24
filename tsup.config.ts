// tsup 미설치 상태에서도 tsc/next build가 통과하도록 defineConfig를 import하지 않는 순수 객체로 둔다
// (tsup은 default export 객체를 그대로 받는다). 설치 후 빌드: yarn build:lib
const config = {
  entry: { index: "src/index.ts", react: "src/react.ts" },
  format: ["esm", "cjs"],
  dts: true,
  tsconfig: "tsconfig.lib.json",
  outDir: "dist",
  clean: true,
  sourcemap: false,
  treeshake: true,
  splitting: true,
  // 소비자 번들러가 해석하게 둔다: peer + 런타임 의존성은 번들에 포함하지 않는다
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@base-ui/react",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "qrcode-generator",
    "tailwind-merge",
  ],
  // /react 진입점은 훅·window를 쓰므로 Next App Router에서 클라이언트 경계가 되어야 한다.
  // esbuild는 번들하면서 "use client"를 지우므로 onSuccess에서 다시 붙인다.
  // package.json에 "type"이 없으므로 출력은 ESM=.mjs, CJS=.js 이다
  async onSuccess() {
    // 로직 진입점(index)에는 "use client"를 붙이지 않는다. react 진입점만 후처리
    const { readFile, writeFile } = await import("node:fs/promises");
    for (const file of ["dist/react.mjs", "dist/react.js"]) {
      const code = await readFile(file, "utf8");
      if (!code.startsWith('"use client"')) await writeFile(file, `"use client";\n${code}`);
    }
  },
};

export default config;
