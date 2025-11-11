'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Activity } from 'lucide-react'
import { GymIcon, gymIcons } from '@/lib/gym-icons'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const pathname = usePathname()
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false)

  React.useEffect(() => {
    // Hide bottom nav when keyboard appears (input/textarea focused)
    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setIsKeyboardVisible(true)
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Small delay to prevent flickering
        setTimeout(() => setIsKeyboardVisible(false), 100)
      }
    }

    // Visual Viewport API for more accurate keyboard detection
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height
        const windowHeight = window.innerHeight
        // If viewport is significantly smaller than window, keyboard is likely visible
        setIsKeyboardVisible(windowHeight - viewportHeight > 150)
      }
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    }

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      isGymIcon: false,
    },
    {
      href: '/log-workout',
      label: 'Workout',
      icon: gymIcons.workout,
      isGymIcon: true,
    },
    {
      href: '/log-activity',
      label: 'Activity',
      icon: Activity,
      isGymIcon: false,
    },
  ]

  // Hide nav when keyboard is visible
  if (isKeyboardVisible) {
    return null
  }

  return (
    <nav 
      className="fixed left-0 right-0 z-50 md:hidden border-t border-neutral-800 bg-neutral-950/98 backdrop-blur-lg transition-transform duration-200"
      style={{ 
        bottom: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="grid grid-cols-3 h-14 sm:h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 transition-colors',
                isActive
                  ? 'text-orange-500'
                  : 'text-neutral-400 hover:text-neutral-300'
              )}
            >
              {item.isGymIcon ? (
                <GymIcon
                  icon={Icon}
                  className={cn(
                    'h-6 w-6',
                    isActive ? 'text-orange-500' : 'text-neutral-400'
                  )}
                />
              ) : (
                <Icon className="h-6 w-6" />
              )}
              <span className={cn(
                'text-xs font-medium',
                isActive && 'text-orange-500'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

