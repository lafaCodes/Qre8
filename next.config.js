const { execSync } = require('child_process');

// Get git commit SHA (short) - fallback for non-git environments
let gitCommitSha = 'unknown';
try {
  gitCommitSha = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  console.warn('Could not get git commit SHA');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Trailing slashes for Cloudflare Pages compatibility
  trailingSlash: true,
  
  // Inject build-time environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: require('./package.json').version,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_GIT_COMMIT: gitCommitSha,
  },
}

module.exports = nextConfig
