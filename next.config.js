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
    // REMOVED: We now use L0G1n SDK to securely proxy GitHub requests without leaking PATs.
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
    // Force Next.js to use the same React instance for local symlinked packages
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, '.', 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, '.', 'node_modules', 'react-dom'),
    };
    return config
  }
}
