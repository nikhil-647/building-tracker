'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home, WifiOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            reset={() => this.setState({ hasError: false, error: null })}
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()
  const isNetworkError = !navigator.onLine || 
    error.message.toLowerCase().includes('network') ||
    error.message.toLowerCase().includes('fetch')

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            {isNetworkError ? (
              <WifiOff className="h-5 w-5 text-red-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            {isNetworkError ? 'Connection Error' : 'Something went wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-neutral-400">
            {isNetworkError
              ? 'Unable to connect to the server. Please check your internet connection and try again.'
              : 'An unexpected error occurred. Please try refreshing the page.'}
          </p>

          {!isNetworkError && (
            <details className="text-xs text-neutral-500 bg-neutral-800 p-3 rounded border border-neutral-700">
              <summary className="cursor-pointer font-medium">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto">{error.message}</pre>
            </details>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => {
                reset()
                router.refresh()
              }}
              className="flex-1 bg-white text-neutral-950 hover:bg-neutral-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex-1 border-neutral-700 hover:bg-neutral-800"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

