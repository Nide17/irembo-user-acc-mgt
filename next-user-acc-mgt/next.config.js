/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: ['irembousers.s3.us-east-2.amazonaws.com'],
    },
    output: 'standalone',
}

module.exports = nextConfig
