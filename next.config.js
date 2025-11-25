// File: next.config.js
/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    REPO: 'luisguilher.me',
    OWNER: 'lguibr',
    SHA_BRANCH: 'main',
    RESUME: 'resume',
    GITHUB_USERNAME: 'lguibr',
    // Expose the PAT from the build environment (e.g., .env.local)
    // For Vercel deployment, set this as an Environment Variable in the project settings.
    GITHUB_PAT: process.env.GITHUB_PAT
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    config.module.rules.push({
      test: /\.md$/,
      use: ['raw-loader']
    })
    return config
  }
}
