'use client'

import { Button } from '@/components/ui/button'
import { Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GymIcon, gymIcons } from '@/lib/gym-icons'

export function HeroButtons() {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
      <Button 
        size="lg" 
        className="h-11 sm:h-12 px-6 sm:px-8 bg-white text-neutral-950 hover:bg-neutral-200 text-sm sm:text-base font-medium" 
        onClick={() => router.push('/log-workout')}
      >
        <GymIcon icon={gymIcons.workout} className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
        Log Workout
      </Button>
      <Button 
        size="lg" 
        className="h-11 sm:h-12 px-6 sm:px-8 bg-white text-neutral-950 hover:bg-neutral-200 text-sm sm:text-base font-medium" 
        onClick={() => router.push('/log-activity')}
      >
        <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
        Log Activity
      </Button>
    </div>
  )
}
