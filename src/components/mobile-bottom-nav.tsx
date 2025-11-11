'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Activity } from 'lucide-react'
import { GymIcon, gymIcons } from '@/lib/gym-icons'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const pathname = usePathname()

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-neutral-800 bg-neutral-950/98 backdrop-blur-lg safe-area-inset-bottom">
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

