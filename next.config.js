/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    REPO: 'luisguilher.me',
    RESUME: 'resume',
    shaBranch: '7892492bd6579182bd098df204ca700bae3afea8'
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
