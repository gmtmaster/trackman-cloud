/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // ⚠️ Engedélyezi a buildet akkor is, ha TS hibák vannak
        ignoreBuildErrors: true,
    },
    eslint: {
        // ⚠️ Engedélyezi a buildet akkor is, ha ESLint hibák vannak
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
