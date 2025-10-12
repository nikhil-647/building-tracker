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
import { Dumbbell, Save, X, Loader2 } from 'lucide-react'
import { getAvailableExercises, addExerciseToUserPlan } from '@/app/api/workout-plan/actions'
import { toast } from 'sonner'

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
    if (isOpen && selectedMuscleGroup) {
      fetchAvailableExercises()
    }
  }, [isOpen, selectedMuscleGroup])

  const fetchAvailableExercises = async () => {
    setIsFetchingExercises(true)
    setErrors({})
    
    try {
      const result = await getAvailableExercises(selectedMuscleGroup)
      
      if (result.success) {
        setAvailableExercises(result.data)
      } else {
        setErrors({ general: result.error || 'Failed to load exercises' })
      }
    } catch (error) {
      setErrors({ general: 'Failed to load exercises' })
    } finally {
      setIsFetchingExercises(false)
    }
  }

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
    } catch (error) {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Add New Exercise
          </DialogTitle>
          <DialogDescription>
            Select an exercise to add to your {selectedMuscleGroup} workout plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* General Error Message */}
          {errors.general && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {errors.general}
            </div>
          )}

          {/* Muscle Group - Disabled (Display Only) */}
          <div className="grid gap-2">
            <Label htmlFor="muscle-group">Muscle Group</Label>
            <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
              {selectedMuscleGroup}
            </div>
          </div>
          
          {/* Exercise Name - Select Dropdown */}
          <div className="grid gap-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            {isFetchingExercises ? (
              <div className="flex items-center justify-center p-3 border rounded-md bg-muted/50">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading exercises...</span>
              </div>
            ) : availableExercises.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground bg-muted/50 rounded-md text-center">
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
                  <SelectTrigger className={`w-full ${errors.exercise ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id.toString()}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.exercise && (
                  <p className="text-sm text-destructive">{errors.exercise}</p>
                )}
              </>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            className="gap-2"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-2"
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
