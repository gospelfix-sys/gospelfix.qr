/** @type {import('next').NextConfig} */
const nextConfig = {
  // 서버가 없는 정적 사이트. 계좌 정보는 URL fragment(#)로만 받아 서버·로그에 남지 않는다
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
