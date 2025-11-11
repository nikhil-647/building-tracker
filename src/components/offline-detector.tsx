'use client'

import * as React from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function OfflineDetector() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [showNotification, setShowNotification] = React.useState(false)

  React.useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showNotification) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
      <Card className={`px-6 py-3 shadow-lg border-2 ${
        isOnline 
          ? 'bg-green-950/95 border-green-700 backdrop-blur-lg' 
          : 'bg-red-950/95 border-red-700 backdrop-blur-lg'
      }`}>
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-400" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-400" />
          )}
          <div>
            <p className={`text-sm font-medium ${
              isOnline ? 'text-green-100' : 'text-red-100'
            }`}>
              {isOnline ? 'Back Online' : 'No Internet Connection'}
            </p>
            <p className={`text-xs ${
              isOnline ? 'text-green-300' : 'text-red-300'
            }`}>
              {isOnline 
                ? 'Your connection has been restored' 
                : 'Some features may be unavailable'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

