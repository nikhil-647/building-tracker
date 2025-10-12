'use client'

import { Button } from '@/components/ui/button'
import { Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GymIcon, gymIcons } from '@/lib/gym-icons'

export function HeroButtons() {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" className="h-12 px-8" onClick={() => router.push('/log-workout')}>
        <GymIcon icon={gymIcons.workout} className="h-5 w-5 mr-2" />
        Log Workout
      </Button>
      <Button size="lg" variant="outline" className="h-12 px-8" onClick={() => router.push('/log-activity')}>
        <Activity className="h-5 w-5 mr-2" />
        Log Activity
      </Button>
    </div>
  )
}
