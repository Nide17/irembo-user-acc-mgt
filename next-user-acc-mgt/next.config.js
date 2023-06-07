/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        images: {
            allowFutureImage: true
        },
        future: {
            webpack5: true,
        },
        optimizeFonts: false, // disables Automatic Webpack 5 Font Optimization
    },
    images: {
        domains: ['irembousers.s3.us-east-2.amazonaws.com'],
    },
    output: 'standalone',
}

module.exports = nextConfig
