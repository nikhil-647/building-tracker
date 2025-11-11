'use client'

import * as React from 'react'
import Link from 'next/link'
import { Flame, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileHeaderProps {
  onUserMenuClick?: () => void
}

export function MobileHeader({ onUserMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            <Flame className="h-7 w-7 text-orange-500" />
            <span className="text-lg font-bold text-white">Tapas</span>
          </div>
        </Link>

        {/* User Menu Button */}
        {onUserMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onUserMenuClick}
            className="h-9 w-9 text-neutral-300 hover:text-white hover:bg-neutral-800"
          >
            <User className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  )
}

