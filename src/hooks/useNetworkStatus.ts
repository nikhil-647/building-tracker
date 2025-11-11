'use client'

import { useState, useEffect } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setIsReconnecting(false)
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
  }, [])

  const checkConnection = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      return false
    }

    try {
      setIsReconnecting(true)
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      setIsReconnecting(false)
      return response.ok
    } catch {
      setIsReconnecting(false)
      return false
    }
  }

  return {
    isOnline,
    isReconnecting,
    checkConnection
  }
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase()
    return (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('networkerror') ||
      !navigator.onLine
    )
  }
  return false
}

export function getErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'No internet connection. Please check your network and try again.'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

