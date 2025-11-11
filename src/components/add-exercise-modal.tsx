'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save, X, Loader2 } from 'lucide-react'
import { getAvailableExercises, addExerciseToUserPlan } from '@/app/api/workout-plan/actions'
import { toast } from 'sonner'
import { GymIcon, gymIcons } from '@/lib/gym-icons'

interface AddExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  selectedMuscleGroup: string
}

export function AddExerciseModal({ isOpen, onClose, onSave, selectedMuscleGroup }: AddExerciseModalProps) {
  const [selectedExerciseId, setSelectedExerciseId] = React.useState<string>('')
  const [availableExercises, setAvailableExercises] = React.useState<Array<{ id: number; name: string; image: string | null }>>([])
  const [errors, setErrors] = React.useState<{ exercise?: string; general?: string }>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetchingExercises, setIsFetchingExercises] = React.useState(false)

  // Fetch available exercises when modal opens or muscle group changes
  React.useEffect(() => {
    const fetchExercises = async () => {
      setIsFetchingExercises(true)
      setErrors({})
      
      try {
        const result = await getAvailableExercises(selectedMuscleGroup)
        
        if (result.success) {
          setAvailableExercises(result.data)
        } else {
          setErrors({ general: result.error || 'Failed to load exercises' })
        }
      } catch {
        setErrors({ general: 'Failed to load exercises' })
      } finally {
        setIsFetchingExercises(false)
      }
    }

    if (isOpen && selectedMuscleGroup) {
      fetchExercises()
    }
  }, [isOpen, selectedMuscleGroup])

  const handleSave = async () => {
    const newErrors: { exercise?: string; general?: string } = {}
    
    if (!selectedExerciseId) {
      newErrors.exercise = 'Please select an exercise'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await addExerciseToUserPlan(Number(selectedExerciseId), selectedMuscleGroup)
      
      if (result.success) {
        toast.success('Exercise added successfully!', {
          description: `${result.data?.exerciseName} has been added to your ${selectedMuscleGroup} workout plan.`
        })
        onSave()
        handleClose()
      } else {
        toast.error('Failed to add exercise', {
          description: result.error || 'An error occurred while adding the exercise.'
        })
        setErrors({ general: result.error || 'Failed to add exercise' })
      }
    } catch {
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.'
      })
      setErrors({ general: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedExerciseId('')
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <GymIcon icon={gymIcons.dumbbell} className="h-5 w-5" />
            Add New Exercise
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Select an exercise to add to your {selectedMuscleGroup} workout plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* General Error Message */}
          {errors.general && (
            <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Muscle Group - Disabled (Display Only) */}
          <div className="grid gap-2">
            <Label htmlFor="muscle-group" className="text-neutral-300">Muscle Group</Label>
            <div className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white">
              {selectedMuscleGroup}
            </div>
          </div>
          
          {/* Exercise Name - Select Dropdown */}
          <div className="grid gap-2">
            <Label htmlFor="exercise-name" className="text-neutral-300">Exercise Name</Label>
            {isFetchingExercises ? (
              <div className="flex items-center justify-center p-3 border border-neutral-700 rounded-md bg-neutral-800">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-white" />
                <span className="text-sm text-neutral-400">Loading exercises...</span>
              </div>
            ) : availableExercises.length === 0 ? (
              <div className="p-3 text-sm text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-md text-center">
                No available exercises. All exercises for this muscle group have been added to your plan.
              </div>
            ) : (
              <>
                <Select
                  value={selectedExerciseId}
                  onValueChange={(value) => {
                    setSelectedExerciseId(value)
                    if (errors.exercise) {
                      setErrors(prev => ({ ...prev, exercise: undefined }))
                    }
                  }}
                >
                  <SelectTrigger className={`w-full bg-neutral-800 border-neutral-700 text-white [&>span]:text-neutral-400 ${errors.exercise ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select an exercise" className="text-neutral-400" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    {availableExercises.map((exercise) => (
                      <SelectItem 
                        key={exercise.id} 
                        value={exercise.id.toString()}
                        className="text-white focus:bg-neutral-700 focus:text-white cursor-pointer"
                      >
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.exercise && (
                  <p className="text-sm text-red-400">{errors.exercise}</p>
                )}
              </>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            onClick={handleClose} 
            className="gap-2 bg-white text-neutral-950 hover:bg-neutral-200"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-2 bg-white text-neutral-950 hover:bg-neutral-200"
            disabled={isLoading || isFetchingExercises || availableExercises.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Exercise
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
