'use client'

import * as React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { X, Flame, User, Settings, LogOut, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GymIcon, gymIcons } from '@/lib/gym-icons'
import { InstallAppButton } from '@/components/install-app-button'

interface NavbarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false) // Close mobile menu before signing out
    await signOut({ callbackUrl: '/' })
  }

  // Prevent body scroll when mobile menu is open
  // Using useLayoutEffect to ensure scroll is disabled before paint
  React.useLayoutEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Mobile header - Only shows logo and user button */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur md:hidden">
        <div className="flex h-12 items-center justify-between px-3">
          <Link href="/dashboard">
            <div className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-opacity">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-base font-bold text-white">Tapas</span>
            </div>
          </Link>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </header>

      {/* Desktop and tablet navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard">
              <div className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                <Flame className="h-7 w-7 text-orange-500" />
                <span className="text-lg font-bold text-white">Tapas</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/log-workout">
                  <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                    <GymIcon icon={gymIcons.workout} className="h-4 w-4 mr-1.5" />
                    Log Workout
                  </Button>
                </Link>
                <Link href="/log-activity">
                  <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                    <Activity className="h-4 w-4 mr-1.5" />
                    Log Activity
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {user && (
                  <>
                    <InstallAppButton />
                    <div className="flex items-center space-x-1.5">
                      <div className="h-7 w-7 rounded-full bg-neutral-800 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-neutral-400" />
                      </div>
                      <span className="text-sm font-medium hidden lg:block text-neutral-300">
                        {user.name || user.email}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSignOut}
                      className="text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
                    >
                      <LogOut className="h-4 w-4 mr-1.5" />
                      <span className="hidden lg:inline">Sign Out</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile User Menu - Only for user profile/settings */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile User Menu */}
          <div className="fixed top-12 left-0 right-0 z-50 md:hidden">
            <Card className="m-3 p-0 shadow-lg bg-neutral-900 border-neutral-800">
              {user && (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 p-3 pb-2">
                    <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center">
                      <User className="h-4 w-4 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <hr className="border-neutral-800" />
                  <InstallAppButton />
                  <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800 h-10 rounded-none">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-neutral-800 h-10 rounded-none"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  )
}
