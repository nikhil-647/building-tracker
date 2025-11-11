'use client'

import * as React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Menu, X, Building2, User, Settings, LogOut, Activity } from 'lucide-react'
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
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard">
              <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">FlexTrack Pro</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/log-workout">
                  <Button variant="ghost" size="sm">
                    <GymIcon icon={gymIcons.workout} className="h-4 w-4 mr-2" />
                    Log Workout
                  </Button>
                </Link>
                <Link href="/log-activity">
                  <Button variant="ghost" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Log Activity
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                {user && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium hidden lg:block">
                        {user.name || user.email}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSignOut}
                      className="text-destructive hover:text-destructive"
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
                className="h-9 w-9"
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
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Navigation Menu */}
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden">
            <Card className="m-4 p-4 space-y-2 shadow-lg">
              <Link href="/dashboard" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/log-workout" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  <GymIcon icon={gymIcons.workout} className="h-4 w-4 mr-2" />
                  Log Workout
                </Button>
              </Link>
              <Link href="/log-activity" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </Link>
              {user && (
                <>
                  <hr className="my-2" />
                  <div className="flex items-center space-x-2 p-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
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
