'use client'

import * as React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = React.useState(false)

  React.useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
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
      setIsInstalled(true)
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
  }

  // Don't show button if already installed or no prompt available
  if (isInstalled || !deferredPrompt) {
    return null
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="ghost"
      size="sm"
      className="text-orange-500 hover:text-orange-400 hover:bg-neutral-800"
    >
      <Download className="h-4 w-4 mr-2" />
      <span className="hidden lg:inline">Install App</span>
      <span className="lg:hidden">Install</span>
    </Button>
  )
}

