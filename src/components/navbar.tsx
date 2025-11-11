'use client'

import * as React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Menu, X, Flame, User, Settings, LogOut, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GymIcon, gymIcons } from '@/lib/gym-icons'

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
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard">
              <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Flame className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold text-white">Tapas</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/log-workout">
                  <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                    <GymIcon icon={gymIcons.workout} className="h-4 w-4 mr-2" />
                    Log Workout
                  </Button>
                </Link>
                <Link href="/log-activity">
                  <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                    <Activity className="h-4 w-4 mr-2" />
                    Log Activity
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                {user && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center">
                        <User className="h-4 w-4 text-neutral-400" />
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
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="hidden lg:inline">Sign Out</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="h-9 w-9 text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Positioned as a separate layer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Navigation Menu */}
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden">
            <Card className="m-4 p-4 space-y-2 shadow-lg bg-neutral-900 border-neutral-800">
              <Link href="/dashboard" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800">
                  Dashboard
                </Button>
              </Link>
              <Link href="/log-workout" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800">
                  <GymIcon icon={gymIcons.workout} className="h-4 w-4 mr-2" />
                  Log Workout
                </Button>
              </Link>
              <Link href="/log-activity" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800">
                  <Activity className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </Link>
              {user && (
                <>
                  <hr className="my-2 border-neutral-800" />
                  <div className="flex items-center space-x-2 p-2">
                    <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center">
                      <User className="h-4 w-4 text-neutral-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                      <p className="text-xs text-neutral-400">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white hover:bg-neutral-800">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  )
}
