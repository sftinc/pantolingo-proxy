import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@pantolingo/db', '@pantolingo/lang'],
}

export default nextConfig
