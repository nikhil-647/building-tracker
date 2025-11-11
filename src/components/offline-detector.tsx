'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function OfflineDetector() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [isReconnecting, setIsReconnecting] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setIsReconnecting(true)
      
      // Wait a moment to ensure connection is stable, then redirect to dashboard
      setTimeout(() => {
        console.log('Connection restored, redirecting to dashboard...')
        router.push('/dashboard')
        router.refresh()
        setIsReconnecting(false)
      }, 1000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setIsReconnecting(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [router])

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsReconnecting(true)
      router.push('/dashboard')
      router.refresh()
      setTimeout(() => setIsReconnecting(false), 1000)
    }
  }

  // Show full-screen blocking overlay when offline
  if (!isOnline || isReconnecting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-neutral-950/98 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative bg-red-950/50 p-6 rounded-full border-2 border-red-800">
                {isReconnecting ? (
                  <RefreshCw className="h-16 w-16 text-green-400 animate-spin" />
                ) : (
                  <WifiOff className="h-16 w-16 text-red-400 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isReconnecting ? 'Reconnecting...' : 'No Internet Connection'}
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              {isReconnecting 
                ? 'Getting you back online...'
                : 'This app requires an active internet connection to work. Please check your connection and try again.'}
            </p>
          </div>

          {/* Retry Button */}
          {!isReconnecting && (
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-semibold py-6 text-base"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Retry Connection
              </Button>
              <p className="text-xs text-neutral-600">
                The app will automatically reconnect when your internet is restored
              </p>
            </div>
          )}

          {/* Connection Status Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-600">
            <div className={`w-2 h-2 rounded-full ${
              isReconnecting 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-red-500 animate-pulse'
            }`}></div>
            <span>{isReconnecting ? 'Reconnecting' : 'Offline'}</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

