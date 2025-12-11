import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // 💡 아래 부분 추가: Three.js 관련 라이브러리를 강제로 변환(Transpile)합니다.
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
};

export default nextConfig;
