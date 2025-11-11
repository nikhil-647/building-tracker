declare module 'next-pwa' {
  import { NextConfig } from 'next'

  interface PWAConfig {
    dest?: string
    disable?: boolean
    register?: boolean
    scope?: string
    sw?: string
    runtimeCaching?: Array<{
      urlPattern: RegExp | string
      handler: 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate'
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      options?: {
        cacheName?: string
        expiration?: {
          maxEntries?: number
          maxAgeSeconds?: number
        }
        cacheableResponse?: {
          statuses?: number[]
        }
        backgroundSync?: {
          name: string
          options?: {
            maxRetentionTime?: number
          }
        }
        broadcastUpdate?: {
          channelName?: string
        }
        matchOptions?: {
          ignoreSearch?: boolean
          ignoreMethod?: boolean
          ignoreVary?: boolean
        }
        networkTimeoutSeconds?: number
        plugins?: unknown[]
        fetchOptions?: RequestInit
        rangeRequests?: boolean
      }
    }>
    skipWaiting?: boolean
    buildExcludes?: Array<string | RegExp>
    publicExcludes?: string[]
    cacheOnFrontEndNav?: boolean
    reloadOnOnline?: boolean
    fallbacks?: {
      document?: string
      image?: string
      audio?: string
      video?: string
      font?: string
    }
  }

  type WithPWA = (config: PWAConfig) => (nextConfig: NextConfig) => NextConfig

  const withPWA: WithPWA
  export default withPWA
}

