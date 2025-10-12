'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddExerciseModal } from '@/components/add-exercise-modal'
import { useRouter } from 'next/navigation'

interface AddExerciseButtonProps {
  muscleGroup: string
}

export function AddExerciseButton({ muscleGroup }: AddExerciseButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSave = () => {
    setIsOpen(false)
    // Router refresh will trigger server component re-fetch
    router.refresh()
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Exercise
      </Button>

      <AddExerciseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        selectedMuscleGroup={muscleGroup}
      />
    </>
  )
}

