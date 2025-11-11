'use client'

import * as React from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = React.useState(false)

  React.useEffect(() => {
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed === 'true') {
      console.log('[PWA Install] Prompt previously dismissed by user')
      return // Don't show prompt if user dismissed it before
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA Install] App already installed')
      return // Don't show prompt if already installed
    }

    console.log('[PWA Install] Setting up install prompt listener')

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      console.log('[PWA Install] beforeinstallprompt event fired - showing prompt')
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Update UI to notify the user they can install the PWA
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt so it can only be used once
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    console.log('[PWA Install] User dismissed the prompt - will not show again')
    setShowPrompt(false)
    // Store dismissal permanently - user said "not now" means never
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-neutral-900/95 border-orange-600/50 backdrop-blur-lg shadow-2xl">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Install Tapas</h3>
                <p className="text-xs text-neutral-400">Install our app for a better experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-neutral-400 hover:text-white"
            >
              Not now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

