/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    REPO: 'luisguilher.me',
    RESUME: 'resume'
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  }
}
