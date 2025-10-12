'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteExerciseFromUserPlan } from '@/app/api/workout-plan/actions'
import { toast } from 'sonner'

interface DeleteExerciseButtonProps {
  planId: number
  exerciseName: string
  muscleGroup: string
}

export function DeleteExerciseButton({ planId, exerciseName, muscleGroup }: DeleteExerciseButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!confirm(`Remove ${exerciseName} from ${muscleGroup}?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteExerciseFromUserPlan(planId)
      
      if (result.success) {
        toast.success('Exercise deleted successfully!', {
          description: result.message || `${exerciseName} has been removed from your workout plan.`
        })
        // Use startTransition for smoother updates
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error('Failed to delete exercise', {
          description: result.error || 'An error occurred while deleting the exercise.'
        })
      }
    } catch (error) {
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const isLoading = isDeleting || isPending

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isLoading}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}

