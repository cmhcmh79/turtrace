// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Capacitor용 정적 export
  // output: 'export',
  
  // 이미지 최적화 비활성화 (정적 export 필요)
  images: {
    unoptimized: true,
  },
  
  // Trailing slash (모바일 라우팅 안정성)
  trailingSlash: true,
  
  // 환경변수 (빌드 시점에 주입)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig